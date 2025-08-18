import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiService } from "../services/apiService";

const ApiErrorContext = createContext();

export const useApiError = () => {
  const context = useContext(ApiErrorContext);
  if (!context) {
    throw new Error("useApiError must be used within ApiErrorProvider");
  }
  return context;
};

export const ApiErrorProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [networkError, setNetworkError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [retryQueue, setRetryQueue] = useState([]);

  const processRetryQueue = useCallback(async () => {
    if (retryQueue.length === 0) return;

    for (const retryFn of retryQueue) {
      try {
        await retryFn();
      } catch (error) {
        console.warn("Retry failed:", error);
      }
    }
    setRetryQueue([]);
  }, [retryQueue]);

  const handleNetworkError = useCallback((error, retryFn) => {
    setNetworkError({
      type: "NETWORK_ERROR",
      message: error.message || "Network request failed",
      timestamp: Date.now(),
      retry: retryFn,
    });
    if (retryFn) {
      setRetryQueue((prev) => [...prev, retryFn]);
    }
  }, []);

  const handleAuthError = useCallback((error) => {
    setAuthError({
      type: "AUTH_ERROR",
      message: error.message || "Authentication failed",
      timestamp: Date.now(),
    });
    // Clear user session
    localStorage.removeItem("token");
    // Redirect to login after a brief delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setNetworkError(null);
      // Auto-retry queued requests when back online
      processRetryQueue();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setNetworkError({
        type: "NETWORK_ERROR",
        message: "No internet connection",
        timestamp: Date.now(),
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set up global error handler for apiService
    const errorHandler = {
      handleNetworkError,
      handleAuthError,
    };
    apiService.setErrorHandler(errorHandler);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleNetworkError, handleAuthError, processRetryQueue]);

  const clearNetworkError = () => setNetworkError(null);
  const clearAuthError = () => setAuthError(null);
  const clearRetryQueue = () => setRetryQueue([]);

  const value = {
    isOffline,
    networkError,
    authError,
    retryQueue: retryQueue.length,
    handleNetworkError,
    handleAuthError,
    clearNetworkError,
    clearAuthError,
    clearRetryQueue,
    processRetryQueue,
  };

  return (
    <ApiErrorContext.Provider value={value}>
      {children}
    </ApiErrorContext.Provider>
  );
};
