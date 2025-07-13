import React from "react";
import "./Buttons.css";

function FillBtn({ url }) {
  return (
    <a href={url} className="filled-btn">
      <p>Show all Blogs</p>
    </a>
  );
}

export default FillBtn;
