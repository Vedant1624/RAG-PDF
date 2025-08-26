
import React from 'react';
import './About.css';

import { FaBook, FaBolt, FaLock, FaBrain } from 'react-icons/fa';

function About() {
  return (
    <section className="about-container" id="about">
      <div className="about-content">
        <h2>About This Project</h2>
        <p className="about-description">
          This application is a powerful tool built with a Retrieval-Augmented Generation (RAG) architecture. It allows you to get instant, accurate answers from your PDF documents. Simply upload a file, and our AI will read, understand, and provide streaming responses to your questions, saving you hours of study and research time.
        </p>
        
        <h3>Key Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <FaBook size={40} className="feature-icon" />
            <h4>Any PDF Document</h4>
            <p>From dense textbooks and research papers to legal contracts, get insights from any PDF.</p>
          </div>
          <div className="feature-card">
            <FaBolt size={40} className="feature-icon" />
            <h4>Instant Answers</h4>
            <p>Leverages advanced AI to provide quick and relevant answers to your specific questions.</p>
          </div>
          <div className="feature-card">
            <FaLock size={40} className="feature-icon" />
            <h4>Secure & Private</h4>
            <p>Your documents are processed securely, and your data remains private and confidential.</p>
          </div>
           <div className="feature-card">
            <FaBrain size={40} className="feature-icon" />
            <h4>Powered by RAG</h4>
            <p>Utilizes a state-of-the-art RAG model for context-aware and accurate information retrieval.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;