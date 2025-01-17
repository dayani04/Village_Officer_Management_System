import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ensure react-router-dom is installed
import NavBar from './Components/molecules/NavBar/NavBar'; // Adjust the path if necessary
import Footer from  './Components/molecules/Footer/Footer';
import Home from './Components/molecules/Pages/Home/Home';
import AboutUs from './Components/molecules/Pages/AboutUs/AboutUs';
import ContactUs from './Components/molecules/Pages/Contact/Contact';
import VillageOfficerDashBoard from './Components/molecules/Pages/VillageOfficerDashBoard/VillageOfficerDashBoard'

function App() {
  return (
    <div className="App">
      <NavBar />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="AboutUs" element={<AboutUs/>} />
        <Route path="ContactUs" element={<ContactUs/>} />
        <Route path="VillageOfficerDashBoard" element={<VillageOfficerDashBoard/>} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
