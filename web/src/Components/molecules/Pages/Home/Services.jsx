import React from "react";
import CommonHeading from "./CommonHeading";
import './Services.css'; // Import CSS for styling

export default function Services() {
  const services = [
    {
      id: 1,
      name: "Apply To Election",
      discription: "Register to vote and ensure your name is included in the electoral list for upcoming elections.",
    },
    {
      id: 2,
      name: "Apply To Allowances",
      discription: "Submit applications for government allowances and financial assistance programs.",
    },
    {
      id: 3,
      name: "Apply To Certificate",
      discription: "Request official village officer certificates for various legal and personal purposes.",
    },
    {
      id: 4,
      name: "Apply To ID Card",
      discription: "Apply for a temporary or permanent National Identity Card easily through the system.",
    },
    {
      id: 5,
      name: "Apply To Permits",
      discription: "Obtain necessary permits for land, business, and other and more official requirements.",
    },
    {
      id: 6,
      name: "Found Village Notification",
      discription: "Stay updated with important announcements and notices from the village office.",
    },
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <CommonHeading
            heading="Our Services"
            title="Services"
            subtitle="Explore Our"
          />
        </div>
        <div className="row g-4">
          {services.map((item) => (
            <div
              key={item.id}
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <a
                className="service-item card-hover-effect rounded"
                href="#"
                tabIndex="0" // Enable focus via arrow keys
              >
                <div className="service-icon d-flex justify-content-center align-items-center mb-3">
                  {item.icon}
                </div>
                <h5 className="service-name mb-3 text-center">{item.name}</h5> {/* Added a custom class here */}
                <p className="text-body mb-0 text-center">{item.discription}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
