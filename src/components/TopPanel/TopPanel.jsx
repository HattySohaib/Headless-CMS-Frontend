import React from "react";
import "./TopPanel.css";
import { Link } from "react-router-dom";

import {} from "@remixicon/react";
import logo from "../../assets/logo2.png";

import { useTheme } from "../../contexts/theme";
import ProfileButton from "../ProfileButton/ProfileButton";

function TopPanel() {
  const { theme } = useTheme();
  return (
    <div id="top-panel" className={`top-panel-${theme}`}>
      <Link className="logo-header" to="/">
        <img src={logo} alt="Bloggest" />
      </Link>
      <div className="top-panel-div">
        <ProfileButton />
      </div>
    </div>
  );
}

export default TopPanel;
