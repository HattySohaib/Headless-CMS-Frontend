// src/Slide1.js
import React, { useState } from "react";
import "./Slide.css";
import { RiArrowRightLine } from "@remixicon/react";
import { Link } from "react-router-dom";

import GhostLoader from "../GhostLoader/GhostLoader";

const Slide = ({ header, preview, bannerimg, id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoaded = () => {
    setIsLoading(false);
  };
  return (
    <div className="featured-card">
      <div className="featured-card-img">
        {isLoading && (
          <GhostLoader width={"100%"} height={"100%"} radius={"0"} />
        )}
        <img
          onLoad={handleImageLoaded}
          style={{ display: isLoading ? "none" : "block" }}
          src={bannerimg}
          alt=""
        />
      </div>
      <div className="icon-wrapper">
        <RiArrowRightLine className="arrow-icon" size={24} />
      </div>
      <div className="featured-card-data">
        <p className="featured">Featured</p>
        <h2 className="header">{header}</h2>
        <p className="preview">{preview}</p>
        <Link to={`/read-this-blog/${id}`} className="read-btn">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Slide;
