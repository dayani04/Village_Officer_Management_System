import react from "react";
import './Contact.css';
import email from './emaillogo.png';
import fb from './facebooklogo.png';
import phone from './phonelogo.png';
import wapp from './watsapplogo.png';

const ContactUs = () => {
    return(
    <div className="contact-container">
    <h1>Contact Us</h1>
    <div className="contact-item">
      <img src={phone} alt="Phone" className="icon" />
      <span>+94 914 567 890</span>
    </div>
    <div className="contact-item">
      <img src={email} alt="Email" className="icon" />
      <span>villageofficer@gmail.com</span>
    </div>
    <div className="contact-item">
      <img src={wapp} alt="WhatsApp" className="icon" />
      <span>+94 917 654 321</span>
    </div>
    <div className="contact-item">
      <img src={fb} alt="Facebook" className="icon" />
      <span>
        <a href="" target="_blank" rel="noopener noreferrer">
          Facebook Page
        </a>
      </span>
    </div>
  </div>
);
};

export default ContactUs;