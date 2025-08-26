// NavBar.jsx
import React from 'react';
import { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa"
import "./nav.css"

function NavBar() {
  const navRef = useRef();

  const showNavBar = () => {
    navRef.current.classList.toggle("responsive_nav");
  }

  return (
    <header>
      <a href="#working" className="header-logo">
        <h3>RAG-PDF</h3>
      </a>
      <nav ref={navRef}>
        <a href='#working'>Home</a>
        <a href='#about'>About</a>
        <a href='#connect'>Connect</a>
        <button className='nav-btn nav-close-btn' onClick={showNavBar}>
          <FaTimes />
        </button>
      </nav>
      <button className='nav-btn' onClick={showNavBar}>
        <FaBars />
      </button>
    </header>
  );
};

export default NavBar;
