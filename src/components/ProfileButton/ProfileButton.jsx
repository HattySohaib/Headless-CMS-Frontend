import React, { useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { useUserContext } from "../../contexts/user";
import { Link } from "react-router-dom";

import "./ProfileButton.css";

import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiLogoutCircleLine,
  RiHomeLine,
  RiDashboardLine,
  RiSettings3Line,
  RiMessage2Line,
} from "@remixicon/react";

import { useTheme } from "../../contexts/theme";
import Loader from "../Loader/Loader";
import GhostLoader from "../GhostLoader/GhostLoader";

function ProfileButton() {
  const { theme } = useTheme();
  const { userData } = useUserContext();
  const { logout } = useAuthContext();

  const [menuVisible, setMenuVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!userData) {
    return <GhostLoader width={"10rem"} height={"3rem"} radius={"0.5rem"} />;
  }

  return (
    <div id="Profile-dropdown" className={`nav-${theme}`}>
      <div className="nav-account" onClick={toggleMenu}>
        <div style={{ position: "relative" }}>
          {!imageLoaded && (
            <GhostLoader width={"2.5rem"} height={"2.5rem"} radius={"50%"} />
          )}
          <img
            src={userData?.profileImageUrl}
            alt=""
            className="dp"
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>
        <div className="acc-details">
          <p className="acc-name">{userData?.fullName}</p>
          <p className="acc-email">@{userData?.username}</p>
        </div>
        {menuVisible ? (
          <RiArrowUpSLine color="#727272" />
        ) : (
          <RiArrowDownSLine color="#727272" />
        )}
      </div>
      {menuVisible && (
        <div className="profile-menu">
          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to={"/playground/dashboard"}
          >
            <RiDashboardLine size="1rem" />
            <span>Dashboard</span>
          </Link>

          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to="/playground/messages"
          >
            <RiMessage2Line size="1rem" />
            <span>Messages</span>
          </Link>

          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to="/playground/settings"
          >
            <RiSettings3Line size="1rem" />
            <span>Settings</span>
          </Link>

          <div className="menu-divider"></div>

          <Link
            className="profile-dd-link home-link"
            onClick={toggleMenu}
            to="/"
          >
            <RiHomeLine size="1rem" />
            <span>Back to Home</span>
          </Link>

          <button className="logout-btn" onClick={logout}>
            <RiLogoutCircleLine size="1rem" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
