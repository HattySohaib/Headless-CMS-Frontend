import React from "react";
import ErrorFallback from "../ErrorFallback/ErrorFallback";

/**
 * AsyncErrorBoundary - Specialized for handling async operation errors
 * Good for wrapping components that make API calls
 */
class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AsyncErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error with additional context
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorContext = {
      component: this.props.name || "AsyncErrorBoundary",
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...this.props.context,
    };

    console.error("Async Error Context:", errorContext);

    // TODO: Send to error reporting service
    // logErrorToService(error, { ...errorInfo, ...errorContext });
  };

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback or default ErrorFallback
      const FallbackComponent = this.props.fallback || ErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          resetErrorBoundary={this.handleRetry}
          title={this.props.title || "Something went wrong"}
          message={
            this.props.message ||
            "An error occurred while loading this content."
          }
          showRetry={this.props.showRetry !== false}
          compact={this.props.compact}
        />
      );
    }

    return this.props.children;
  }
}

export default AsyncErrorBoundary;
