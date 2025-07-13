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

function LeftPanel() {
  const { theme } = useTheme();

  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    toggleExpanded();
  };

  const [expanded, setExpanded] = React.useState(true);

  const toggleExpanded = () => {
    if (expanded === true) {
      setExpanded(!expanded);
    } else {
      setTimeout(() => {
        setExpanded(!expanded);
      }, 150);
    }
  };

  return (
    <div
      className={`side-panel collapsed-${collapsed} left side-panel-${theme}`}
    >
      <div className="panel-container">
        <div className="side-bar-btn-holder">
          <button onClick={toggleCollapse} className="side-bar-btn">
            {!collapsed ? (
              <RiSidebarFoldLine color="#E16449" />
            ) : (
              <RiSidebarUnfoldLine color="#E16449" />
            )}
          </button>
        </div>
        <div className="navigation">
          <NavLink
            activeClassName="active"
            to="/playground/dashboard"
            className="panel-nav-link"
          >
            <RiDashboardFill />
            {!expanded ? null : "Dashboard"}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/playground/all-blogs"
            className="panel-nav-link"
          >
            <RiDonutChartFill />
            {!expanded ? null : "All Blogs"}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/playground/featured-blogs"
            className="panel-nav-link"
          >
            <RiStackedView />
            {!expanded ? null : "Featured Blogs"}
          </NavLink>
          <NavLink
            activeClassName="active"
            to="/playground/categories"
            className="panel-nav-link"
          >
            <RiEqualizer2Fill />
            {!expanded ? null : "Categories"}
          </NavLink>
        </div>
      </div>
      <div className="other-options">
        <NavLink
          activeClassName="active"
          to="/playground/edit-profile"
          className="panel-nav-link"
        >
          <RiAccountCircleFill size={"1.25rem"} />
          {!expanded ? null : "Edit Profile"}
        </NavLink>
        <NavLink
          activeClassName="active"
          to="/playground/change-password"
          className="panel-nav-link"
        >
          <RiLockPasswordFill size={"1.25rem"} />
          {!expanded ? null : "Change Password"}
        </NavLink>
        <NavLink
          activeClassName="active"
          to="/playground/get-api-key"
          className="panel-nav-link"
        >
          <RiKeyFill size={"1.25rem"} />
          {!expanded ? null : "API Keys"}
        </NavLink>
      </div>
    </div>
  );
}

export default LeftPanel;
