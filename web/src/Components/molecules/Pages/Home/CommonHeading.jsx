import React from "react";

export default function CommonHeading({ heading, title, subtitle }) {
  return (
    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
      <h6
        className="section-title text-center text-uppercase"
        style={{ color: "#921940 " }}
      >
        {heading}
      </h6>
      <h1 className="mb-5">
        {subtitle}{" "}
        <span
          className="text-uppercase"
          style={{ color: "#921940" }}
        >
          {title}
        </span>
      </h1>
    </div>
  );
}
