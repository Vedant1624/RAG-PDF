import os
import asyncio
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores.chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from pypdf import PdfReader


load_dotenv()


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


vector_store = None
retriever = None


llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", stream=True)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

prompt = PromptTemplate(
    template="""
    You are an assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question.
    If you don't know the answer, just say that you don't know.
    Use three sentences maximum and keep the answer concise.

    Question: {input}
    Context: {context}
    Answer:
    """,
    input_variables=["input", "context"],
)



@app.get("/")
def read_root():
    return {"message": "Welcome to the RAG API!"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global vector_store, retriever
    
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are allowed."}, 400

    try:
        pdf_reader = PdfReader(file.file)
        text = "".join(page.extract_text() or "" for page in pdf_reader.pages)
        
        if not text.strip():
            return {"error": "Could not extract text from the PDF."}, 400

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_text(text)
        vector_store = Chroma.from_texts(texts=splits, embedding=embeddings)
        retriever = vector_store.as_retriever()
        return {"message": "Pdf successfully inserted"}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred during PDF processing."}, 500



async def stream_chain(chain, question: str):
    """
    A robust async generator to stream only new answer tokens.
    It yields data in Server-Sent Event (SSE) format.
    """
    async for chunk in chain.astream_log({"input": question}, include_names=["ChatGoogleGenerativeAI"]):
        for op in chunk.ops:
            if op["op"] == "add" and op["path"].startswith("/logs/ChatGoogleGenerativeAI/streamed_output_str/-"):
                new_token = op["value"]
                if new_token: 
                    yield f"data: {new_token}\n\n"
                    await asyncio.sleep(0.01)

@app.post("/ask")
async def ask_question(question: str = Form(...)):
    """
    This endpoint now streams the response back to the client.
    """
    global retriever
    
    if not retriever:
        return {"error": "Please upload a PDF first."}, 400

    document_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    
    return StreamingResponse(stream_chain(retrieval_chain, question), media_type="text/event-stream")