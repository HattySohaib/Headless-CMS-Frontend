import logo from "../../assets/logo.png";

import "./Navbar.css";

import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useUserContext } from "../../contexts/user";
import { useTheme } from "../../contexts/theme";
import GhostLoader from "../GhostLoader/GhostLoader";
import {
  RiMoonFill,
  RiSunFill,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuthContext();
  const { userData } = useUserContext();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
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
            <Link to={"/"} className={isActiveRoute("/") ? "active" : ""}>
              Home
            </Link>
          </li>
          <li className="nav-list-item">
            <Link
              to={"/trending"}
              className={isActiveRoute("/trending") ? "active" : ""}
            >
              Trending
            </Link>
          </li>
          <li className="nav-list-item">
            <Link
              to={"/documentation"}
              className={isActiveRoute("/documentation") ? "active" : ""}
            >
              Documentation
            </Link>
          </li>
          <li className="nav-list-item">
            <Link
              to={"https://www.npmjs.com/package/irada-widgets"}
              className={isActiveRoute("/widgets") ? "active" : ""}
            >
              Widgets
            </Link>
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
              <div className="nav-profile-section">
                <Link to="/dashboard" className="nav-dashboard-link">
                  {userData && (
                    <div className="nav-dashboard-profile-container">
                      {!imageLoaded && (
                        <GhostLoader
                          width={"1.5rem"}
                          height={"1.5rem"}
                          radius={"50%"}
                        />
                      )}
                      <img
                        src={userData?.profileImageUrl}
                        alt="Profile"
                        className="nav-dashboard-profile-img"
                        onLoad={handleImageLoad}
                        style={{ display: imageLoaded ? "block" : "none" }}
                      />
                    </div>
                  )}
                  <span>Dashboard</span>
                  <RiArrowRightSLine size="1.2rem" />
                </Link>
              </div>
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
          {user && userData && (
            <div className="mobile-profile-btn">
              <div className="mobile-nav-profile-image">
                {!imageLoaded && (
                  <GhostLoader width={"2rem"} height={"2rem"} radius={"50%"} />
                )}
                <img
                  src={userData?.profileImageUrl}
                  alt="Profile"
                  className="mobile-nav-dp"
                  onLoad={handleImageLoad}
                  style={{ display: imageLoaded ? "block" : "none" }}
                />
              </div>
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
          {user && (
            <div className="mobile-dashboard-section">
              <Link
                to="/dashboard"
                className="mobile-dashboard-link"
                onClick={closeMobileMenu}
              >
                <span>Go to Dashboard</span>
                <RiArrowRightSLine size="1.2rem" />
              </Link>
            </div>
          )}

          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link
                to={"/"}
                onClick={closeMobileMenu}
                className={isActiveRoute("/") ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to={"/trending"}
                onClick={closeMobileMenu}
                className={isActiveRoute("/trending") ? "active" : ""}
              >
                Trending
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to={"/"}
                onClick={closeMobileMenu}
                className={isActiveRoute("/documentation") ? "active" : ""}
              >
                Documentation
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to={"/widgets"}
                onClick={closeMobileMenu}
                className={isActiveRoute("/widgets") ? "active" : ""}
              >
                Widgets
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
