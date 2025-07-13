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
  RiNotification4Line,
  RiDashboardLine,
  RiSettings3Line,
  RiUser3Line,
} from "@remixicon/react";

import { useTheme } from "../../contexts/theme";

function ProfileButton() {
  const { theme, toggleTheme } = useTheme();
  const { userData } = useUserContext();
  const { logout } = useAuthContext();

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div id="Profile-dropdown" className={`nav-${theme}`}>
      <div className="nav-account" onClick={toggleMenu}>
        <img src={userData?.profile_image_url} alt="" className="dp" />
        <div className="acc-details">
          <p className="acc-name">{userData?.full_name}</p>
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
            to="/playground/settings"
          >
            <RiSettings3Line size="1rem" />
            <span>Settings</span>
          </Link>

          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to="/playground/profile"
          >
            <RiUser3Line size="1rem" />
            <span>Profile</span>
          </Link>

          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to="/playground/notifications"
          >
            <RiNotification4Line size="1rem" />
            <span>Notifications</span>
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
