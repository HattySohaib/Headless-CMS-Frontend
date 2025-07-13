import React from "react";
import "./Footer.css";
import { useTheme } from "../../contexts/theme";

function Footer() {
  const { theme } = useTheme();
  return (
    <div id="footer" className={`footer-${theme}`}>
      <p className="footer-text">Terms of Use & Privacy Policy</p>
      <p className="footer-text">
        Designed & Developed by <a>Sohaib Aftab</a>
      </p>
      <p className="footer-text">Copyright@2024</p>
    </div>
  );
}

export default Footer;
