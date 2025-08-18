import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/theme";
import ProfileButton from "../ProfileButton/ProfileButton";
import "./PlaygroundNavbar.css";
import { UserProvider, useUserContext } from "../../contexts/user";
import { useAuthContext } from "../../contexts/auth";
import GhostLoader from "../GhostLoader/GhostLoader";
import { Link } from "react-router-dom";
import {
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDashboardLine,
  RiMessage2Line,
  RiSettings3Line,
  RiHomeLine,
  RiLogoutCircleLine,
} from "@remixicon/react";
import { useNavigate } from "react-router-dom";

const PlaygroundNavbar = () => {
  const { theme } = useTheme();
  const { logout } = useAuthContext();
  const { userData } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;

    if (path === "/dashboard") {
      return ["Dashboard"];
    } else if (path === "/dashboard/featured-blogs") {
      return ["Dashboard", "Featured Blogs"];
    } else if (path === "/dashboard/blogs") {
      return ["Dashboard", "Blogs"];
    } else if (path === "/dashboard/messages") {
      return ["Dashboard", "Messages"];
    } else if (path === "/dashboard/settings") {
      return ["Dashboard", "Settings"];
    }

    return ["Dashboard"];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <div className={`playground-navbar playground-navbar-${theme}`}>
        <div className="playground-navbar-left">
          <button onClick={handleBackClick} className="back-button">
            <RiArrowLeftSLine size={20} />
          </button>
          <div className="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="breadcrumb-item">
                {crumb}
                {index < breadcrumbs.length - 1 && (
                  <span className="breadcrumb-separator">
                    <RiArrowRightSLine size={16} />
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="playground-navbar-right">
          {/* Desktop - Full ProfileButton */}
          <div className="desktop-profile">
            <UserProvider>
              <ProfileButton />
            </UserProvider>
          </div>

          {/* Mobile - Profile Image with Dropdown */}
          <div className="mobile-profile">
            <div className="mobile-profile-container">
              <button
                className="mobile-profile-button"
                onClick={toggleMobileMenu}
              >
                <div className="mobile-profile-content">
                  {!imageLoaded && userData && (
                    <GhostLoader
                      width={"2rem"}
                      height={"2rem"}
                      radius={"50%"}
                    />
                  )}
                  {userData && (
                    <img
                      src={userData?.profileImageUrl}
                      alt="Profile"
                      className="mobile-profile-image"
                      onLoad={handleImageLoad}
                      style={{ display: imageLoaded ? "block" : "none" }}
                    />
                  )}
                  <div className="mobile-dropdown-arrow">
                    {isMobileMenuOpen ? (
                      <RiArrowUpSLine size={16} />
                    ) : (
                      <RiArrowDownSLine size={16} />
                    )}
                  </div>
                </div>
              </button>

              {/* Mobile Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="mobile-profile-menu">
                  <Link
                    className="mobile-profile-link"
                    onClick={closeMobileMenu}
                    to="/dashboard"
                  >
                    <RiDashboardLine size="1rem" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    className="mobile-profile-link"
                    onClick={closeMobileMenu}
                    to="/dashboard/messages"
                  >
                    <RiMessage2Line size="1rem" />
                    <span>Messages</span>
                  </Link>

                  <Link
                    className="mobile-profile-link"
                    onClick={closeMobileMenu}
                    to="/dashboard/settings"
                  >
                    <RiSettings3Line size="1rem" />
                    <span>Settings</span>
                  </Link>

                  <div className="mobile-menu-divider"></div>

                  <Link
                    className="mobile-profile-link home-link"
                    onClick={closeMobileMenu}
                    to="/"
                  >
                    <RiHomeLine size="1rem" />
                    <span>Back to Home</span>
                  </Link>

                  <button
                    className="mobile-logout-btn"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    <RiLogoutCircleLine size="1rem" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-profile-overlay" onClick={closeMobileMenu}></div>
      )}
    </>
  );
};

const PlaygroundNavbarWrapper = () => {
  return (
    <UserProvider>
      <PlaygroundNavbar />
    </UserProvider>
  );
};

export default PlaygroundNavbarWrapper;
