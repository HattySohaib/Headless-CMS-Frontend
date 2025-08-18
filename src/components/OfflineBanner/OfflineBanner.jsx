import React from "react";
import "./OfflineBanner.css";
import {
  RiWifiOffLine,
  RiRefreshLine,
  RiCloseCircleLine,
} from "@remixicon/react";
import { useApiError } from "../../contexts/apiError";

const OfflineBanner = () => {
  const {
    isOffline,
    networkError,
    retryQueue,
    clearNetworkError,
    clearRetryQueue,
  } = useApiError();

  if (!isOffline && !networkError) return null;

  const handleRetry = async () => {
    if (networkError?.retry) {
      try {
        await networkError.retry();
        clearNetworkError();
      } catch (error) {
        console.warn("Manual retry failed:", error);
      }
    }
  };

  const handleDismiss = () => {
    clearNetworkError();
    clearRetryQueue();
  };

  return (
    <div className="offline-banner">
      <div className="offline-banner-content">
        <div className="offline-banner-left">
          <RiWifiOffLine size={20} className="offline-icon" />
          <div className="offline-text">
            <span className="offline-title">
              {isOffline ? "No internet connection" : "Connection issues"}
            </span>
            <span className="offline-message">
              {isOffline
                ? "Please check your connection and try again"
                : networkError?.message ||
                  "Some features may not work properly"}
            </span>
          </div>
        </div>

        <div className="offline-banner-actions">
          {retryQueue > 0 && (
            <span className="retry-count">{retryQueue} pending</span>
          )}

          {networkError?.retry && (
            <button
              className="offline-retry-btn"
              onClick={handleRetry}
              disabled={isOffline}
            >
              <RiRefreshLine size={16} />
              Retry
            </button>
          )}

          <button
            className="offline-dismiss-btn"
            onClick={handleDismiss}
            title="Dismiss"
          >
            <RiCloseCircleLine size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;
