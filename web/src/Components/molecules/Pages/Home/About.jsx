import React from "react";


export default function About() {
  const about = [
    {
      icon: <i className="fa fa-hotel fa-2x mb-2" style={{ color: "#0d0a0b" }}></i>,
      text: "Rooms",
      count: "5178",
    },
    {
      icon: <i className="fa fa-users fa-2x mb-2" style={{ color: "#0d0a0b" }}></i>,
      text: "Staffs",
      count: "1024",
    },
    {
      icon: <i className="fa fa-users-cog fa-2x mb-2" style={{ color: "#0d0a0b" }}></i>,
      text: "Clients",
      count: "3478",
    },
  ];

  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h6 className="section-title text-start" style={{ color: "#921940" }}>
                About Us
              </h6>
              <h1 className="mb-4">
                Welcome to{" "}
                <span className="text-uppercase" style={{ color: "#921940" }}>
                  Village Officer Management System
                </span>
              </h1>
              <p className="mb-4">
              Our website provides a convenient and fast solution for accessing village officer services. Register and fulfill your needs easily.
              </p>
             
              <a className="btn" href="" style={{ backgroundColor: "#921940", color: "#fff", padding: "10px 20px", borderRadius: "5px" }}>
                Explore More
              </a>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-end">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.1s"
                    src="/assets/img/about1.jpg"
                    style={{ marginTop: "25%" }}
                  />
                </div>
                <div className="col-6 text-start">
                  <img
                    className="img-fluid rounded w-100 wow zoomIn"
                    data-wow-delay="0.3s"
                    src="/assets/img/about2.jpg"
                  />
                </div>
                <div className="col-6 text-end">
                  <img
                    className="img-fluid rounded w-50 wow zoomIn"
                    data-wow-delay="0.5s"
                    src="/assets/img/about3.jpg"
                  />
                </div>
                <div className="col-6 text-start">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.7s"
                    src="/assets/img/about4.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
