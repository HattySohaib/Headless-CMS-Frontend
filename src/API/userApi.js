import { toast } from "react-toastify";
import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";

export const userApi = {
  // Authentication
  async login(credentials) {
    const res = await apiService.post("/users/login", credentials);
    if (res.success) toast.success(res.message);
    else toast.warn(res.message);
    return res;
  },

  async signup(userData) {
    const res = await apiService.post("/users", userData);
    if (res.success) toast.success(res.message);
    else toast.warn(res.message);
    return res;
  },

  async logout() {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  // User profile
  async getUser(id) {
    const res = await apiService.get(`/users/${id}`);
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  async updateProfile(id, profileData) {
    const res = await apiService.patch(
      `/users/${id}`,
      profileData,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    else toast.success(res.message);
    return res;
  },

  async changePassword(id, passwordData) {
    const res = await apiService.patch(
      `/users/${id}/password`,
      passwordData,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    else toast.success(res.message);
    return res;
  },

  // User interactions
  async followUser(id) {
    return apiService.post(
      `/users/${id}/follow`,
      {},
      apiService.getAuthHeaders()
    );
  },

  async unfollowUser(id) {
    return apiService.delete(
      `/users/${id}/follow`,
      apiService.getAuthHeaders()
    );
  },

  // Get users (public)
  async getUsers(filters = {}) {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `/users?${queryString}` : "/users";
    const res = await apiService.get(endpoint);
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  //check username availability
  async checkUsername(username) {
    const queryString = buildQueryString({ username });
    const res = await apiService.get(`/users/check-username?${queryString}`);
    if (!res.success) toast.warn(res.message);
    return res.data.available;
  },

  // Check if user exists
  async checkUserExists(filters = {}) {
    const queryString = buildQueryString(filters);
    const res = await apiService.get(
      `/users${queryString ? `?${queryString}` : ""}`
    );
    return res.data;
  },
};
