import React from "react";
import logo from "../../assets/logo2.png";

import "./Navbar.css";

import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import ProfileButton from "../ProfileButton/ProfileButton";

export default function Navbar() {
  const { user } = useAuthContext();

  const { theme, toggleTheme } = useTheme();

  return (
    <div id="navbar" className={`nav-${theme}`}>
      <div className="logo-container">
        <Link to={"/"}>
          <img className="navbar-logo" src={logo} alt="" />
        </Link>
        <button onClick={toggleTheme}>Theme</button>
      </div>
      <ul className="nav-list">
        <li className="nav-list-item">
          <Link to={"/"}>About</Link>
        </li>
        <li className="nav-list-item">
          <Link to={"/"}>Contact</Link>
        </li>
        <li className="nav-list-item">
          <Link to={"/blogs"}>Discover Blogs</Link>
        </li>
      </ul>

      <div className="nav-btns">
        {user ? (
          <div className="logged-nav">
            <Link to={"/playground/dashboard"} className="playground-btn">
              Write a Blog
            </Link>
            <ProfileButton />
          </div>
        ) : (
          <>
            <Link to={"/login"} className="login-btn">
              Login
            </Link>
            <Link to={"/signup"} className="join-btn">
              Join Us
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
