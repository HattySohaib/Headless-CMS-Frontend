import { useState, useEffect } from "react";

/**
 * Hook to create an error boundary-like behavior in functional components
 * This doesn't replace ErrorBoundary but helps with async error handling
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const resetError = () => setError(null);

  const handleError = (error, context = {}) => {
    console.error("Error caught by useErrorHandler:", error, context);
    setError({ error, context, timestamp: Date.now() });

    // TODO: Send to error reporting service
    // logErrorToService(error, context);
  };

  // Auto-reset error after 5 seconds (optional)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    error,
    handleError,
    resetError,
    hasError: !!error,
  };
};

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return function WrappedComponent(props) {
    // This will be imported dynamically to avoid circular dependencies
    const ErrorBoundary = require("../ErrorBoundary/ErrorBoundary").default;

    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};
