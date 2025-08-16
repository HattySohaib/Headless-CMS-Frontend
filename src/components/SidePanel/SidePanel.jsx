import React from "react";

import "./SidePanel.css";

import { NavLink } from "react-router-dom";

import {
  RiDashboardFill,
  RiDonutChartFill,
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
  RiStackedView,
  RiEqualizer2Fill,
  RiMailFill,
  RiSettings3Fill,
} from "@remixicon/react";

import { useTheme } from "../../contexts/theme";

function LeftPanel({ isOpen, onClose }) {
  const { theme } = useTheme();

  const [collapsed, setCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on component mount and window resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCollapse = () => {
    if (!isMobile) {
      // Only allow collapse on desktop
      setCollapsed(!collapsed);
      toggleExpanded();
    }
  };

  const [expanded, setExpanded] = React.useState(true);

  const toggleExpanded = () => {
    if (!isMobile && expanded === true) {
      // Only allow collapse animation on desktop
      setExpanded(!expanded);
    } else if (!isMobile) {
      setTimeout(() => {
        setExpanded(!expanded);
      }, 150);
    }
  };

  // Force expanded state on mobile
  const shouldShowLabels = isMobile || expanded;

  return (
    <div
      className={`side-panel collapsed-${collapsed} left side-panel-${theme} ${
        isOpen ? "mobile-open" : ""
      }`}
    >
      <div className="panel-container">
        {/* Desktop collapse button - hidden on mobile */}
        {!isMobile && (
          <div className="side-bar-btn-holder">
            <button onClick={toggleCollapse} className="side-bar-btn">
              {!collapsed ? (
                <RiSidebarFoldLine color="#E16449" />
              ) : (
                <RiSidebarUnfoldLine color="#E16449" />
              )}
            </button>
          </div>
        )}

        <div className="navigation">
          <NavLink
            to="/playground/dashboard"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiDashboardFill />
            {shouldShowLabels && "Dashboard"}
          </NavLink>
          <NavLink
            to="/playground/all-blogs"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiDonutChartFill />
            {shouldShowLabels && "All Blogs"}
          </NavLink>
          <NavLink
            to="/playground/featured-blogs"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiStackedView />
            {shouldShowLabels && "Featured Blogs"}
          </NavLink>
          <NavLink
            to="/playground/categories"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiEqualizer2Fill />
            {shouldShowLabels && "Categories"}
          </NavLink>
          <NavLink
            to="/playground/messages"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiMailFill />
            {shouldShowLabels && "Messages"}
          </NavLink>
        </div>
      </div>
      <div className="other-options">
        <NavLink
          to="/playground/settings"
          className={({ isActive }) =>
            isActive ? "panel-nav-link active" : "panel-nav-link"
          }
          onClick={isMobile ? onClose : undefined}
        >
          <RiSettings3Fill size={"1.25rem"} />
          {shouldShowLabels && "Settings"}
        </NavLink>
      </div>
    </div>
  );
}

export default LeftPanel;
