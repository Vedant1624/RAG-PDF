import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import axios from 'axios';
import './style.css';

function Working() {
  const [file, setFile] = useState(null);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      setIsPdfUploaded(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question || isLoading) return;

    const userMessage = { sender: 'user', text: question };
    
    setMessages(prev => [...prev, userMessage, { sender: 'ai', text: '' }]);
    setIsLoading(true);
    setQuestion('');

    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ question })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.substring(6); 

          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.text += data;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Error getting an answer.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="App" >
    //   <header className="App-header">
    <section className="App-header" id="working">
        {!isPdfUploaded && (
          <>
            {/* <h1>RAG PDF Project</h1> */}
            <h1>Get Instant Answers from Any PDF. <br/>
              Save Hours of Study Time</h1>
            <div className="model-sec">
              <Spline scene="https://prod.spline.design/ioiGDIwbWx9Un6r9/scene.splinecode" />
            </div>
          </>
        )}
        {!isPdfUploaded ? (
          <div className="upload-section">
            <h2>Upload a PDF</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleFileUpload} disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>
        ) : (
          <div className="chat-section">
            <h2>Ask a Question</h2>
            <div className="chat-window">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Type your question here..."
                disabled={isLoading}
              />
              <button onClick={handleAskQuestion} disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Send'}
              </button>
            </div>
          </div>
        )}
    </section>
  );
}

export default Working;