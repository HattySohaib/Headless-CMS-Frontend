import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";

/**
 * User-related API calls - Returns standardized response envelopes
 * UI components should handle success/error messaging
 */
export const userApi = {
  // Authentication
  async login(credentials) {
    return await apiService.post("/users/login", credentials);
  },

  async signup(userData) {
    return await apiService.post("/users", userData);
  },

  async logout() {
    localStorage.removeItem("token");
    return Promise.resolve({
      success: true,
      message: "Logged out successfully",
    });
  },

  // User profile
  async getUser(id) {
    return await apiService.get(`/users/${id}`);
  },

  async updateProfile(id, profileData) {
    return await apiService.patch(
      `/users/${id}`,
      profileData,
      apiService.getAuthHeaders()
    );
  },

  async changePassword(id, passwordData) {
    return await apiService.patch(
      `/users/${id}/password`,
      passwordData,
      apiService.getAuthHeaders()
    );
  },

  // User interactions
  async followUser(id) {
    return await apiService.post(
      `/users/${id}/follow`,
      {},
      apiService.getAuthHeaders()
    );
  },

  async unfollowUser(id) {
    return await apiService.delete(
      `/users/${id}/follow`,
      apiService.getAuthHeaders()
    );
  },

  // Get users (public)
  async getUsers(filters = {}) {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `/users?${queryString}` : "/users";
    return await apiService.get(endpoint);
  },

  //check username availability
  async checkUsername(username) {
    const queryString = buildQueryString({ username });
    return await apiService.get(`/users/check-username?${queryString}`);
  },

  // Check if user exists
  async checkUserExists(filters = {}) {
    const queryString = buildQueryString(filters);
    return await apiService.get(
      `/users${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get top authors by views
  async getTopAuthors(limit = 5) {
    return await apiService.get(`/users/top-authors/week`);
  },
};
