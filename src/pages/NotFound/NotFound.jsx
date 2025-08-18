import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NotFound.css";
import { useTheme } from "../../contexts/theme";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme?.() || { theme: "light" }; // fallback if provider missing
  return (
    <main
      className={`notfound-container ${theme}`}
      role="main"
      aria-labelledby="notfound-heading"
      data-theme={theme}
    >
      <div className="notfound-code" aria-hidden>
        404
      </div>
      <h1 id="notfound-heading" className="notfound-title">
        Page not found
      </h1>
      <p className="notfound-message">
        The path <code>{location.pathname}</code> doesn&apos;t exist or may have
        been moved.
      </p>
      <div className="notfound-actions">
        <Link to="/" className="nf-btn primary">
          Go Home
        </Link>
        <button className="nf-btn" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
      <p className="notfound-hint">
        If you believe this is an error, please report it via the feedback
        option.
      </p>
    </main>
  );
};

export default NotFound;
