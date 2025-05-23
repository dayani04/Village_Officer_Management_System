import React from "react";
import "./Footer.css"; // Create a separate CSS file for styles
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div className="footer-container my-0">
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: "#9C284F" }}>
        <div className="container p-4 pb-0">
          <section>
            <div className="row">
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">ශ්‍රී ලංකා ග්‍රාම සේවක</h6>
                <h6 className="text-uppercase mb-4 font-weight-bold">கிராம அதிகாரி</h6>
                <h6 className="text-uppercase mb-4 font-weight-bold">Village officers of sri lanka</h6>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Usefull Links</h6>
                <p><a href="/AboutUs" className="text-white">About Us</a></p>
                <p><a href="SecretaryDashBoard" className="text-white">Privacy Policy</a></p>
                <p><a href="/ContactUs" className="text-white">Contact Details</a></p>
                <p><a href="VillageOfficerDashBoard" className="text-white">Help</a></p>
              </div>

           
              <hr className="w-100 clearfix d-md-none" />

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p><i className="fas fa-envelope mr-3"></i> villageofficer@gmail.com</p>
                <p><i className="fas fa-phone mr-3"></i> +94 914 567 890</p>
                <p><i className="fas fa-print mr-3"></i> +94 914 567 890</p>
              </div>
            </div>
          </section>

          <hr className="my-3" />

          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                <div className="p-3">
                  © 2024 Copyright
                </div>
              </div>

            
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
