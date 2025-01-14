import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ensure react-router-dom is installed
import NavBar from './Components/molecules/NavBar/NavBar'; // Adjust the path if necessary
import Footer from  './Components/molecules/Footer/Footer';
import Home from './Components/molecules/Pages/Home/Home';

function App() {
  return (
    <div className="App">
      <NavBar />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
