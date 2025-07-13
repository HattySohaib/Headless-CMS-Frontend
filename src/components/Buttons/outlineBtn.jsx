import React from "react";
import "./Buttons.css";
function OutlineBtn({ url }) {
  return (
    <a href={url} className="outlined-btn">
      <p>View Services</p>
    </a>
  );
}

export default OutlineBtn;
