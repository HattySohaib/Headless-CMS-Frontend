import { toast } from "react-toastify";

/**
 * Simple API Service for centralized HTTP requests
 */
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || "/api";

    // Remove trailing slash if present
    if (this.baseURL.endsWith("/")) {
      this.baseURL = this.baseURL.slice(0, -1);
    }
  }

  /**
   * Generic request method
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} - Response promise
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      toast.error("API Request failed:", error);
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise} - JSON data
   */
  async get(endpoint, headers = {}) {
    const response = await this.request(endpoint, {
      method: "GET",
      headers,
    });
    return response.json();
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise} - JSON data
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
    return response.json();
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise} - JSON data
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
    return response.json();
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise} - JSON data
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
    return response.json();
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise} - JSON data
   */
  async delete(endpoint, headers = {}) {
    const response = await this.request(endpoint, {
      method: "DELETE",
      headers,
    });
    return response.json();
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
