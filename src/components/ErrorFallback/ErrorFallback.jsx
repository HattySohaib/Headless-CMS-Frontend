import React from "react";
import "./ErrorFallback.css";
import { RiErrorWarningLine, RiRefreshLine } from "@remixicon/react";

const ErrorFallback = ({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  showRetry = true,
  compact = false,
}) => {
  return (
    <div
      className={`error-fallback ${compact ? "error-fallback-compact" : ""}`}
    >
      <div className="error-fallback-content">
        <div className="error-fallback-icon">
          <RiErrorWarningLine size={compact ? 32 : 48} />
        </div>

        <h3 className="error-fallback-title">{title}</h3>
        <p className="error-fallback-message">{message}</p>

        {process.env.NODE_ENV === "development" && error && (
          <details className="error-fallback-details">
            <summary>Error Details</summary>
            <pre className="error-fallback-stack">{error.toString()}</pre>
          </details>
        )}

        {showRetry && (
          <button className="error-fallback-retry" onClick={resetErrorBoundary}>
            <RiRefreshLine size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
