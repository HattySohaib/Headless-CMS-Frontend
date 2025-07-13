import React from "react";

function ColoredBtn({ onClick, text, icon }) {
  return (
    <button className="btn colored-btn" onClick={onClick}>
      <span>{text}</span>
      <span className="material-symbols-outlined btn-icon">{icon}</span>
    </button>
  );
}

export default ColoredBtn;
