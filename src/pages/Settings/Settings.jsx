import React, { useState } from "react";
import "./Settings.css";
import { useTheme } from "../../contexts/theme";
import AuthorProfile from "../AuthorProfile/AuthorProfile";
import Password from "../Password/Password";
import AccessTokenPage from "../AccessTokenPage/AccessTokenPage";
import { RiUserLine, RiLockPasswordLine, RiKeyLine } from "@remixicon/react";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme } = useTheme();

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: RiUserLine,
      component: AuthorProfile,
    },
    {
      id: "password",
      label: "Password",
      icon: RiLockPasswordLine,
      component: Password,
    },
    {
      id: "api-keys",
      label: "API Keys",
      icon: RiKeyLine,
      component: AccessTokenPage,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div id="settings" className={`settings-${theme}`}>
      <div className="settings-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">Settings</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Top Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default Settings;
