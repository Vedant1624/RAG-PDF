import React from 'react';
import Working from './components/Working';
import NavBar from './components/NavBar';
import About from './components/About';
import Connect from './components/Connect';
import Footer from './components/Footer';

function App() {
  return (
   <div className="App">
      <NavBar />
      <main>
        <Working />
        <About />
        <Connect /> 
      </main>
      <Footer /> 
    </div>
  )
}

export default App
