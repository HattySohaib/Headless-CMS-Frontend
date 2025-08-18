import React from "react";
import "./ErrorBoundary.css";
import {
  RiErrorWarningLine,
  RiRefreshLine,
  RiHomeLine,
} from "@remixicon/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // TODO: Log to error reporting service (Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <RiErrorWarningLine size={64} />
            </div>

            <h1 className="error-title">
              {this.props.title || "Oops! Something went wrong"}
            </h1>

            <p className="error-message">
              {this.props.message ||
                "We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage."}
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button
                className="error-btn error-btn-primary"
                onClick={this.handleRetry}
              >
                <RiRefreshLine size={20} />
                Try Again
              </button>

              <button
                className="error-btn error-btn-secondary"
                onClick={this.handleGoHome}
              >
                <RiHomeLine size={20} />
                Go Home
              </button>
            </div>

            {this.props.showContact && (
              <p className="error-contact">
                If this problem persists, please contact our support team.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
