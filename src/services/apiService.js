import { toast } from "react-toastify";

/**
 * Enhanced API Service with timeout, retry, and centralized error handling
 */
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || "/api";
    this.defaultTimeout = 18000; // 18 seconds
    this.retryAttempts = new Map(); // Track retry attempts

    // Remove trailing slash if present
    if (this.baseURL.endsWith("/")) {
      this.baseURL = this.baseURL.slice(0, -1);
    }
  }

  /**
   * Create timeout controller
   */
  createTimeoutController(timeout = this.defaultTimeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
  }

  /**
   * Categorize error type based on backend response format
   */
  async categorizeError(error, response) {
    // Check for AbortError (timeout)
    if (error && error.name === "AbortError") {
      return {
        type: "TIMEOUT_ERROR",
        category: "network",
        message: "Request timed out. Please check your connection.",
        retryable: true,
        originalError: error,
      };
    }

    // Check for offline status
    if (!navigator.onLine) {
      return {
        type: "OFFLINE_ERROR",
        category: "network",
        message: "No internet connection.",
        retryable: true,
        originalError: error,
      };
    }

    // If we have a response, try to parse the backend's standardized format
    if (response) {
      let responseData = null;

      try {
        // Clone the response to avoid consuming it
        const responseClone = response.clone();
        responseData = await responseClone.json();
      } catch (parseError) {
        // If JSON parsing fails, fall back to status code categorization
        console.warn("Failed to parse response JSON:", parseError);
      }

      const status = response.status;

      // Handle 4xx errors (client errors) - usually non-retryable
      if (status >= 400 && status < 500) {
        if (status === 401) {
          return {
            type: "AUTH_ERROR",
            category: "auth",
            code: responseData?.code || "UNAUTHORIZED",
            message:
              responseData?.message ||
              "Authentication required. Please log in.",
            retryable: false,
            fieldErrors: responseData?.errors || null,
            originalError: error,
            timestamp: responseData?.timestamp,
          };
        }

        if (status === 403) {
          return {
            type: "PERMISSION_ERROR",
            category: "auth",
            code: responseData?.code || "FORBIDDEN",
            message:
              responseData?.message ||
              "You don't have permission to access this resource.",
            retryable: false,
            fieldErrors: responseData?.errors || null,
            originalError: error,
            timestamp: responseData?.timestamp,
          };
        }

        if (status === 400) {
          return {
            type: "VALIDATION_ERROR",
            category: "validation",
            code: responseData?.code || "VALIDATION_ERROR",
            message: responseData?.message || "Invalid request data.",
            retryable: false,
            fieldErrors: responseData?.errors || null,
            originalError: error,
            timestamp: responseData?.timestamp,
          };
        }

        if (status === 404) {
          return {
            type: "NOT_FOUND_ERROR",
            category: "client",
            code: responseData?.code || "NOT_FOUND",
            message: responseData?.message || "Requested resource not found.",
            retryable: false,
            fieldErrors: responseData?.errors || null,
            originalError: error,
            timestamp: responseData?.timestamp,
          };
        }

        if (status === 409) {
          return {
            type: "CONFLICT_ERROR",
            category: "client",
            code: responseData?.code || "CONFLICT",
            message:
              responseData?.message ||
              "Resource already exists or conflict occurred.",
            retryable: false,
            fieldErrors: responseData?.errors || null,
            originalError: error,
            timestamp: responseData?.timestamp,
          };
        }

        // Other 4xx errors
        return {
          type: "CLIENT_ERROR",
          category: "client",
          code: responseData?.code || "CLIENT_ERROR",
          message: responseData?.message || "Client error occurred.",
          retryable: false,
          fieldErrors: responseData?.errors || null,
          originalError: error,
          timestamp: responseData?.timestamp,
        };
      }

      // Handle 5xx errors (server errors) - usually retryable
      if (status >= 500) {
        return {
          type: "SERVER_ERROR",
          category: "server",
          code: responseData?.code || "SERVER_ERROR",
          message:
            responseData?.message || "Server error. Please try again later.",
          retryable: true,
          fieldErrors: responseData?.errors || null,
          originalError: error,
          timestamp: responseData?.timestamp,
        };
      }
    }

    // If we have an error but no response, it's likely a network issue
    if (error && !response) {
      return {
        type: "NETWORK_ERROR",
        category: "network",
        message: "Network request failed. Please try again.",
        retryable: true,
        originalError: error,
      };
    }

    // Default case for unknown errors
    return {
      type: "UNKNOWN_ERROR",
      category: "unknown",
      message: error?.message || "An unexpected error occurred.",
      retryable: false,
      originalError: error,
    };
  }

  /**
   * Handle different error types with backend response format support
   */
  async handleError(error, response, endpoint, options, attempt = 1) {
    const errorInfo = await this.categorizeError(error, response);
    const maxRetries = 3;
    const shouldRetry = errorInfo.retryable && attempt < maxRetries;

    console.error(`API Error [${errorInfo.type}] ${endpoint}:`, {
      error,
      response,
      errorInfo,
      attempt,
    });

    // Handle different error categories with improved logic
    switch (errorInfo.category) {
      case "network":
        if (shouldRetry) {
          // Auto-retry network errors with exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
          console.log(
            `Retrying ${endpoint} in ${delay}ms (attempt ${attempt}/${maxRetries})`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request(endpoint, options, attempt + 1);
        }

        // Trigger global network error handling
        if (window.apiErrorHandler) {
          window.apiErrorHandler.handleNetworkError(errorInfo, () =>
            this.request(endpoint, options)
          );
        }
        break;

      case "auth":
        // Don't show toast for auth errors, let context handle it
        if (window.apiErrorHandler) {
          window.apiErrorHandler.handleAuthError(errorInfo);
        }
        break;

      case "validation":
        // Show detailed validation errors
        if (errorInfo.fieldErrors) {
          const fieldErrorMessages = Object.values(errorInfo.fieldErrors).join(
            ", "
          );
          toast.error(`Validation failed: ${fieldErrorMessages}`);
        } else {
          toast.error(errorInfo.message);
        }
        break;

      case "client":
        // 4xx errors (except auth/validation) - show user-friendly message
        if (errorInfo.type === "NOT_FOUND_ERROR") {
          toast.warn(errorInfo.message);
        } else if (errorInfo.type === "CONFLICT_ERROR") {
          toast.warn(errorInfo.message);
        } else {
          toast.error(errorInfo.message);
        }
        break;

      case "server":
        // 5xx errors - these are retryable for some operations
        if (shouldRetry && (options.method === "GET" || !options.method)) {
          // Only auto-retry GET requests for server errors
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(
            `Auto-retrying GET request ${endpoint} after server error in ${delay}ms (attempt ${attempt}/${maxRetries})`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request(endpoint, options, attempt + 1);
        }

        // For non-GET requests or when retries exhausted, show error
        toast.error(`Server error: ${errorInfo.message}`);
        break;

      default:
        toast.error(errorInfo.message);
    }
    // Pattern A: For expected 4xx (auth / validation / client) return envelope instead of throwing
    if (["auth", "validation", "client"].includes(errorInfo.category)) {
      return {
        success: false,
        code: errorInfo.type || errorInfo.code || "CLIENT_ERROR",
        message: errorInfo.message,
        errors: errorInfo.fieldErrors || null,
        category: errorInfo.category,
        retryable: errorInfo.retryable,
        timestamp: new Date().toISOString(),
      };
    }

    // Re-throw for unexpected / retryable categories (network, server, unknown)
    const enhancedError = new Error(errorInfo.message);
    enhancedError.type = errorInfo.type;
    enhancedError.category = errorInfo.category;
    enhancedError.retryable = errorInfo.retryable;
    enhancedError.originalError = error;

    throw enhancedError;
  }

  /**
   * Process backend response format
   * Handles the standardized { success, code, message, data, errors } format
   */
  async processResponse(response) {
    let responseData;

    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error("Failed to parse response JSON:", parseError);
      // If JSON parsing fails, treat as a successful response with empty data
      return { success: true, data: null };
    }

    // Handle different response formats for backward compatibility

    // If response has explicit success field and it's false
    if (responseData.hasOwnProperty("success") && !responseData.success) {
      const error = new Error(responseData.message || "Request failed");
      error.backendResponse = responseData;
      error.code = responseData.code;
      error.fieldErrors = responseData.errors;
      error.timestamp = responseData.timestamp;
      error.category = this.getCategoryFromCode(responseData.code);
      error.type = responseData.code || "UNKNOWN_ERROR";
      error.retryable = this.isRetryable(responseData.code);
      throw error;
    }

    // If response has explicit success field and it's true, return as is
    if (responseData.hasOwnProperty("success") && responseData.success) {
      return responseData;
    }

    // If no success field, assume it's a legacy format and wrap it
    // This handles cases where the backend doesn't use the standardized format yet
    return {
      success: true,
      data: responseData,
      message: "Operation completed successfully",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Determine error category from backend code
   */
  getCategoryFromCode(code) {
    const networkCodes = ["NETWORK_ERROR", "OFFLINE_ERROR", "TIMEOUT_ERROR"];
    const authCodes = ["UNAUTHORIZED", "AUTH_ERROR", "PERMISSION_ERROR"];
    const validationCodes = ["VALIDATION_ERROR"];
    const clientCodes = ["NOT_FOUND", "CONFLICT", "CLIENT_ERROR"];
    const serverCodes = ["SERVER_ERROR"];

    if (networkCodes.includes(code)) return "network";
    if (authCodes.includes(code)) return "auth";
    if (validationCodes.includes(code)) return "validation";
    if (clientCodes.includes(code)) return "client";
    if (serverCodes.includes(code)) return "server";
    return "unknown";
  }

  /**
   * Determine if error is retryable based on code
   */
  isRetryable(code) {
    const retryableCodes = [
      "NETWORK_ERROR",
      "OFFLINE_ERROR",
      "TIMEOUT_ERROR",
      "SERVER_ERROR",
    ];
    return retryableCodes.includes(code);
  }

  /**
   * Enhanced request method with timeout and retry
   */
  async request(endpoint, options = {}, attempt = 1) {
    const url = `${this.baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

    // Setup timeout controller
    const { controller, timeoutId } = this.createTimeoutController(
      options.timeout
    );

    const config = {
      headers: {
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      console.log(`API Request: ${options.method || "GET"} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // For backend that returns standardized format, we need to check the response body
      // even for HTTP 200 responses that might contain success: false
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
        return this.handleError(null, response, endpoint, options, attempt);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Network Error for ${url}:`, error);
      return this.handleError(error, null, endpoint, options, attempt);
    }
  }

  /**
   * GET request with backend response format handling
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise} - Processed response data
   */
  async get(endpoint, headers = {}) {
    const response = await this.request(endpoint, {
      method: "GET",
      headers,
    });
    // If handleError returned an envelope (expected 4xx), short-circuit
    if (response && typeof response.json !== "function") {
      return response;
    }
    return this.processResponse(response);
  }

  /**
   * POST request with backend response format handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise} - Processed response data
   */
  async post(endpoint, data = null, headers = {}) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      if (data instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it
        delete options.headers["Content-Type"];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const response = await this.request(endpoint, options);
    if (response && typeof response.json !== "function") {
      return response;
    }
    return this.processResponse(response);
  }

  /**
   * PUT request with backend response format handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise} - Processed response data
   */
  async put(endpoint, data = null, headers = {}) {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      if (data instanceof FormData) {
        delete options.headers["Content-Type"];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const response = await this.request(endpoint, options);
    if (response && typeof response.json !== "function") {
      return response;
    }
    return this.processResponse(response);
  }

  /**
   * PATCH request with backend response format handling
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise} - Processed response data
   */
  async patch(endpoint, data = null, headers = {}) {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      if (data instanceof FormData) {
        delete options.headers["Content-Type"];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const response = await this.request(endpoint, options);
    if (response && typeof response.json !== "function") {
      return response;
    }
    return this.processResponse(response);
  }

  /**
   * DELETE request with backend response format handling
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise} - Processed response data
   */
  async delete(endpoint, headers = {}) {
    const response = await this.request(endpoint, {
      method: "DELETE",
      headers,
    });
    if (response && typeof response.json !== "function") {
      return response;
    }
    return this.processResponse(response);
  }

  /**
   * Set global error handler reference
   */
  setErrorHandler(errorHandler) {
    window.apiErrorHandler = errorHandler;
  }

  /**
   * Helper method to get authorization headers
   * @param {string} token - Authorization token
   * @returns {Object} - Headers object with authorization
   */
  getAuthHeaders(token) {
    return {
      Authorization: token || localStorage.getItem("token"),
    };
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export default ApiService;
