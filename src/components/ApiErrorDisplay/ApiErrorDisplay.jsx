import React from "react";
import "./ApiErrorDisplay.css";

/**
 * Enhanced error display component for backend response format
 */
const ApiErrorDisplay = ({
  error,
  onRetry,
  showFieldErrors = true,
  className = "",
}) => {
  if (!error) return null;

  const renderFieldErrors = () => {
    if (!showFieldErrors || !error.fieldErrors) return null;

    return (
      <div className="field-errors">
        <h4>Details:</h4>
        <ul>
          {Object.entries(error.fieldErrors).map(([field, message]) => (
            <li key={field}>
              <strong>{field}:</strong> {message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getErrorIcon = () => {
    switch (error.type) {
      case "NETWORK_ERROR":
      case "OFFLINE_ERROR":
        return "🌐";
      case "TIMEOUT_ERROR":
        return "⏰";
      case "AUTH_ERROR":
      case "PERMISSION_ERROR":
        return "🔐";
      case "VALIDATION_ERROR":
        return "⚠️";
      case "NOT_FOUND_ERROR":
        return "🔍";
      case "CONFLICT_ERROR":
        return "⚡";
      case "SERVER_ERROR":
        return "🖥️";
      default:
        return "❌";
    }
  };

  const getErrorSeverity = () => {
    switch (error.category) {
      case "network":
        return "warning";
      case "auth":
        return "error";
      case "validation":
        return "info";
      case "server":
        return "error";
      default:
        return "error";
    }
  };

  return (
    <div className={`api-error-display ${getErrorSeverity()} ${className}`}>
      <div className="error-header">
        <div className="error-icon">{getErrorIcon()}</div>
        <div className="error-info">
          <h3>{error.message}</h3>
          <div className="error-meta">
            <span className="error-type">{error.type.replace("_", " ")}</span>
            {error.code && (
              <span className="error-code">Code: {error.code}</span>
            )}
            {error.timestamp && (
              <span className="error-timestamp">
                {new Date(error.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {renderFieldErrors()}

      {error.retryable && onRetry && (
        <div className="error-actions">
          <button className="retry-button" onClick={onRetry} type="button">
            🔄 Try Again
          </button>
        </div>
      )}

      {process.env.NODE_ENV === "development" && error.originalError && (
        <details className="error-debug">
          <summary>Debug Information</summary>
          <pre>{JSON.stringify(error.originalError, null, 2)}</pre>
        </details>
      )}
    </div>
  );
};

export default ApiErrorDisplay;
