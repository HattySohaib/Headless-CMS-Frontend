import React from "react";
import "./Btn.css";

function GradientBtn({ onClick, text, icon }) {
  return (
    <button className="btn gradient-btn" onClick={onClick}>
      <span>{text}</span>
      <span className="material-symbols-outlined btn-icon">{icon}</span>
    </button>
  );
}

export default GradientBtn;
