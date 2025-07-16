import React from "react";

import "./SidePanel.css";

import { NavLink } from "react-router-dom";

import {
  RiDashboardFill,
  RiDonutChartFill,
  RiAccountCircleFill,
  RiLockPasswordFill,
  RiKeyFill,
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
  RiStackedView,
  RiEqualizer2Fill,
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
            activeClassName="active"
            to="/playground/dashboard"
            className="panel-nav-link"
            onClick={isMobile ? onClose : undefined}
          >
            <RiDashboardFill />
            {shouldShowLabels && "Dashboard"}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/playground/all-blogs"
            className="panel-nav-link"
            onClick={isMobile ? onClose : undefined}
          >
            <RiDonutChartFill />
            {shouldShowLabels && "All Blogs"}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/playground/featured-blogs"
            className="panel-nav-link"
            onClick={isMobile ? onClose : undefined}
          >
            <RiStackedView />
            {shouldShowLabels && "Featured Blogs"}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/playground/categories"
            className="panel-nav-link"
            onClick={isMobile ? onClose : undefined}
          >
            <RiEqualizer2Fill />
            {shouldShowLabels && "Categories"}
          </NavLink>
        </div>
      </div>
      <div className="other-options">
        <NavLink
          activeClassName="active"
          to="/playground/edit-profile"
          className="panel-nav-link"
          onClick={isMobile ? onClose : undefined}
        >
          <RiAccountCircleFill size={"1.25rem"} />
          {shouldShowLabels && "Edit Profile"}
        </NavLink>
        <NavLink
          activeClassName="active"
          to="/playground/change-password"
          className="panel-nav-link"
          onClick={isMobile ? onClose : undefined}
        >
          <RiLockPasswordFill size={"1.25rem"} />
          {shouldShowLabels && "Change Password"}
        </NavLink>
        <NavLink
          activeClassName="active"
          to="/playground/get-api-key"
          className="panel-nav-link"
          onClick={isMobile ? onClose : undefined}
        >
          <RiKeyFill size={"1.25rem"} />
          {shouldShowLabels && "API Keys"}
        </NavLink>
      </div>
    </div>
  );
}

export default LeftPanel;
