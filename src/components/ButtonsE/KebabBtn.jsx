import React from "react";
import "./Btn.css";

function KebabBtn({ onClick, text, icon }) {
  return (
    <button className="btn kebab-btn" onClick={onClick}>
      <span>{text}</span>
      <span className="material-symbols-outlined btn-icon">{icon}</span>
    </button>
  );
}

export default KebabBtn;
