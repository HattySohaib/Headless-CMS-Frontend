import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./Playground.css";

import LeftPanel from "../../components/SidePanel/SidePanel";
import PlaygroundNavbar from "../../components/PlaygroundNavbar/PlaygroundNavbar";
import { useTheme } from "../../contexts/theme";
import { RiSidebarUnfoldLine } from "@remixicon/react";
import ProfileButton from "../../components/ProfileButton/ProfileButton";
import { UserProvider } from "../../contexts/user";

function Panel() {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Close sidebar when switching to desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div id="playground" className={`playground-${theme}`}>
      {/* Mobile Toggle Button beside logo */}
      {isMobile && (
        <button
          className={`mobile-sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
          onClick={toggleSidebar}
        >
          <RiSidebarUnfoldLine color="#E16449" size="1.35rem" />
        </button>
      )}

      {/* Mobile Backdrop */}
      {isMobile && (
        <div
          className={`mobile-sidebar-backdrop ${isSidebarOpen ? "show" : ""}`}
          onClick={closeSidebar}
        ></div>
      )}

      <LeftPanel isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="right">
        <PlaygroundNavbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Panel;
