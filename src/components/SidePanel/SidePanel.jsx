import React from "react";

import "./SidePanel.css";

import { NavLink } from "react-router-dom";

import {
  RiDashboardFill,
  RiDonutChartFill,
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
  RiStackedView,
  RiSettings3Fill,
  RiGithubFill,
  RiExternalLinkLine,
  RiAddCircleFill,
  RiMessage2Fill,
} from "@remixicon/react";

import { useTheme } from "../../contexts/theme";

function LeftPanel({ isOpen, onClose }) {
  const { theme } = useTheme();

  const [collapsed, setCollapsed] = React.useState(() => {
    // Initialize from localStorage, default to false if not found
    const savedState = localStorage.getItem("sidePanel-collapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
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
      const newCollapsedState = !collapsed;
      setCollapsed(newCollapsedState);
      // Save state to localStorage
      localStorage.setItem(
        "sidePanel-collapsed",
        JSON.stringify(newCollapsedState)
      );
      toggleExpanded();
    }
  };

  const [expanded, setExpanded] = React.useState(() => {
    // Initialize expanded state based on collapsed state
    const savedCollapsedState = localStorage.getItem("sidePanel-collapsed");
    return savedCollapsedState ? !JSON.parse(savedCollapsedState) : true;
  });

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
                <RiSidebarFoldLine size={32} color="#E16449" />
              ) : (
                <RiSidebarUnfoldLine size={32} color="#E16449" />
              )}
            </button>
          </div>
        )}

        <div className="navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiDashboardFill />
            {shouldShowLabels && "Dashboard"}
          </NavLink>
          <NavLink
            to="/editor"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiAddCircleFill />
            {shouldShowLabels && "Add Blog"}
          </NavLink>
          <NavLink
            to="/dashboard/blogs"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiDonutChartFill />
            {shouldShowLabels && "All Blogs"}
          </NavLink>
          <NavLink
            to="/dashboard/featured-blogs"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiStackedView />
            {shouldShowLabels && "Featured Blogs"}
          </NavLink>
        </div>
        <div className="navigation">
          <NavLink
            to="/dashboard/messages"
            className={({ isActive }) =>
              isActive ? "panel-nav-link active" : "panel-nav-link"
            }
            onClick={isMobile ? onClose : undefined}
          >
            <RiMessage2Fill />
            {shouldShowLabels && "Messages"}
          </NavLink>
        </div>
      </div>
      <div className="other-options">
        {/* GitHub Repo Card */}
        {shouldShowLabels && (
          <div className="github-card">
            <div className="github-content">
              <div className="github-header">
                <RiGithubFill size={20} />
                <span className="github-title">Irada</span>
              </div>
              <p className="github-desc">View source code on GitHub</p>
              <a
                href="https://github.com/HattySohaib/Headless-CMS-Frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
                onClick={isMobile ? onClose : undefined}
              >
                <span>Visit Repository</span>
                <RiExternalLinkLine size={14} />
              </a>
            </div>
          </div>
        )}
        <NavLink
          to="/dashboard/settings"
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
