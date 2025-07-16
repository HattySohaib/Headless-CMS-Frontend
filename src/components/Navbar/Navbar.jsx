import logo from "../../assets/logo2.png";

import "./Navbar.css";

import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import ProfileButton from "../ProfileButton/ProfileButton";
import {
  RiMoonFill,
  RiSunFill,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div id="navbar" className={`nav-${theme}`}>
        <div className="logo-container">
          <Link to={"/"}>
            <img className="navbar-logo" src={logo} alt="" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav-list desktop-nav">
          <li className="nav-list-item">
            <Link to={"/blogs"}>Blogs</Link>
          </li>
          <li className="nav-list-item">
            <Link to={"/"}>Documentation</Link>
          </li>
          <li className="nav-list-item">
            <Link to={"/"}>Components</Link>
          </li>
        </ul>

        <div className="nav-btns desktop-nav">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme !== "dark" ? (
              <RiSunFill color="#6d6d6d" />
            ) : (
              <RiMoonFill color="#6d6d6d" />
            )}
          </button>
          {user ? (
            <div className="logged-nav">
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

        {/* Mobile Navigation - Profile Button and Menu Button */}
        <div className="mobile-nav-controls">
          {user && (
            <div className="mobile-profile-btn">
              <ProfileButton />
            </div>
          )}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <RiMenuLine size="1.5rem" />
          </button>
        </div>
      </div>

      <div
        className={`nav-${theme} mobile-sidebar ${
          isMobileMenuOpen ? "mobile-sidebar-open" : ""
        }`}
      >
        <div className="mobile-sidebar-header">
          <div className="mobile-header-left">
            {/* Profile button moved to main navbar on mobile */}
          </div>
          <button className="mobile-close-btn" onClick={closeMobileMenu}>
            <RiCloseLine size="1.5rem" />
          </button>
        </div>

        <div className="mobile-sidebar-content">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link to={"/blogs"} onClick={closeMobileMenu}>
                Blogs
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to={"/"} onClick={closeMobileMenu}>
                Documentation
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to={"/"} onClick={closeMobileMenu}>
                Components
              </Link>
            </li>
          </ul>

          <div className="mobile-theme-section">
            <button className="mobile-theme-btn" onClick={toggleTheme}>
              {theme !== "dark" ? (
                <>
                  <RiSunFill size="1.2rem" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <RiMoonFill size="1.2rem" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="mobile-auth-section">
            {!user && (
              <div className="mobile-auth-buttons">
                <Link
                  to={"/login"}
                  className="mobile-login-btn"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="mobile-join-btn"
                  onClick={closeMobileMenu}
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
    </>
  );
}
