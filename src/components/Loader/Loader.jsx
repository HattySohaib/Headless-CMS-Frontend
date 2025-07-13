import React from "react";
import "./Loader.css";
import { useTheme } from "../../contexts/theme";

function Loader() {
  const { theme } = useTheme();
  return (
    <div className={`loader-div loader-${theme}`}>
      <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    </div>
  );
}

export default Loader;
