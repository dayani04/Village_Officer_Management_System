import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel.css';

export default function Carousel() {
  const sliderRef = useRef(null);
  

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,       // Transition speed (1s)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,     // Enable automatic sliding
    autoplaySpeed: 2000, // Time before the next slide (3s)
    rtl: false,         // Move from right to left
    arrows: false       // Hide previous/next arrows
  };
  

  const carouselData = [
    { img: "/assets/img/home1.jpg", title: "ආයුබෝවන්", subtitle: "ඔබ සැම සාදරයෙන් පිලිගනිමු" },
    { img: "/assets/img/home3.jpg", title: "வணக்கம்", subtitle: "உங்கள் அனைவரையும் வருக" },
    { img: "/assets/img/home2.jpg", title: "Welcome", subtitle: "Welcome to all of you" },
  ];
  

  return (
    <div className="carousel-container">
      <Slider ref={sliderRef} {...settings}>
        {carouselData.map((item, index) => (
          <div key={index} className="carousel-slide">
            <img className="carousel-image" src={item.img} alt={item.title} />
            <div className="carousel-caption">
              <h1 className="carousel-h1">{item.title}</h1>
              
            </div>
          </div>
        ))}
      </Slider>
      <button className="carousel-control-prev" onClick={previous}>‹</button>
      <button className="carousel-control-next" onClick={next}>›</button>
    </div>
  );
}
