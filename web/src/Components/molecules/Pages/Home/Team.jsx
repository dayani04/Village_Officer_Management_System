import React from "react";
import CommonHeading from "./CommonHeading";
import './Team.css';

export default function Teams() {
  const socialIcons = [
    { icon: <i className="fab fa-facebook-f"></i> },
    { icon: <i className="fab fa-twitter"></i> },
    { icon: <i className="fab fa-instagram"></i> },
    { icon: <i className="fab fa-linkedin-in"></i> },
    { icon: <i className="fab fa-youtube"></i> },
  ];

  const team = [
    {
      image: "./sinhalaLady.jpg",
      name: "Anna Tomis Mariya (Manager)",
      designation: "Oversees the entire hotel operations, ensuring everything runs smoothly and managing staff and guest relations.",
    },
    {
      image: "tamilLady.avif",
      name: "John Devon Doe (Receptionist)",
      designation: "Responsible for checking guests in and out, answering phone calls, and assisting guests with their needs.",
    },
    {
      image: "./welcomee.jpg",
      name: "Masi Jehnsan (Housekeeper)",
      designation: "Ensures that rooms are clean, well-maintained, organized, and ready for guests.",
    },
  
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <CommonHeading heading="Our Team" subtitle="Explore Our" title="Staffs" />
        <div className="row g-4">
          {team.map((item, index) => (
            <div
              className="col-lg-3 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
              key={index}
            >
              <div className="rounded shadow overflow-hidden team-card">
                <div className="position-relative">
                  <img className="img-fluid" src={item.image} alt="Team member" />
                  <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                    {socialIcons.slice(0, 3).map((val, idx) => (
                      <a
                        className="btn btn-square mx-1 social-icon"
                        href="#"
                        key={idx}
                      >
                        {val.icon}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0">{item.name}</h5>
                  <small>{item.designation}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
