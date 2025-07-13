import React from "react";
import { Outlet } from "react-router-dom";

import "./Playground.css";

import LeftPanel from "../../components/SidePanel/SidePanel";
import { useTheme } from "../../contexts/theme";

function Panel() {
  const { theme } = useTheme();

  return (
    <div id="playground" className={`playground-${theme}`}>
      <LeftPanel />
      <div className="right">
        <Outlet />
      </div>
    </div>
  );
}

export default Panel;
