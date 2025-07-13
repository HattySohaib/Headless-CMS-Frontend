// src/Carousel.js
import React, { useState, useEffect, useRef } from "react";
import "./Carousel.css";
import Slide from "../Slides/Slide";
import { useTheme } from "../../contexts/theme";

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoScrollInterval = useRef(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!isInteracting) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isInteracting, slides.length]);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    setIsInteracting(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStartX.current - touchEndX.current;
    if (touchDiff > 60) {
      // Swiped left
      nextSlide();
    } else if (touchDiff < -60) {
      // Swiped right
      prevSlide();
    }
    setIsInteracting(false);
  };

  const handleMouseEnter = () => {
    setIsInteracting(true);
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };

  const handleMouseLeave = () => {
    setIsInteracting(false);
  };

  return (
    <div className={`carousel-container carousel-${theme}`}>
      <div
        className="carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((SlideComponent, index) => (
            <div className="carousel-item" key={index}>
              <Slide
                header={SlideComponent.title}
                preview={SlideComponent.meta}
                bannerimg={SlideComponent.banner}
                id={SlideComponent._id}
              />
            </div>
          ))}
        </div>
        {showControls && (
          <div className="carousel-btns">
            <button className="carousel-control prev" onClick={prevSlide}>
              &#10094;
            </button>
            <button className="carousel-control next" onClick={nextSlide}>
              &#10095;
            </button>
          </div>
        )}
      </div>
      <div className="carousel-pagination">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
