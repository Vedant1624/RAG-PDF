// src/components/Connect/Connect.jsx
import React from 'react';
import './Connect.css';
// Using the react-icons library we installed earlier
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Connect() {
  return (
    <section className="connect-container" id="connect">
      <div className="connect-content">
        <h2>Connect With Me</h2>
        <p>
          I'm always open to connecting and discussing new projects or ideas.
          <br />
          Feel free to reach out on any of these platforms.
        </p>
        <div className="social-icons">
          <a href="https://github.com/Vedant1624">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/" >
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/">
            <FaTwitter />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Connect;
