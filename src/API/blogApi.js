import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";

/**
 * Blog-related API calls - Returns standardized response envelopes
 * UI components should handle success/error messaging
 */
export const blogApi = {
  // Get blogs with filtering and pagination
  async getBlogs(filters = {}) {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `/blogs?${queryString}` : "/blogs";
    return await apiService.get(endpoint, apiService.getAuthHeaders());
  },

  // Get single blog
  async getBlog(id) {
    return await apiService.get(`/blogs/${id}`);
  },

  // Create new blog
  async createBlog(blogData) {
    return await apiService.post(
      "/blogs",
      blogData,
      apiService.getAuthHeaders()
    );
  },

  // Update blog
  async updateBlog(id, blogData) {
    return await apiService.patch(
      `/blogs/${id}`,
      blogData,
      apiService.getAuthHeaders()
    );
  },

  // Delete blog
  async deleteBlog(id) {
    return await apiService.delete(`/blogs/${id}`, apiService.getAuthHeaders());
  },

  // Blog interactions
  async likeBlog(id) {
    return await apiService.post(
      `/blogs/${id}/like`,
      {},
      apiService.getAuthHeaders()
    );
  },

  async commentOnBlog(id, comment) {
    return await apiService.post(
      `/blogs/${id}/comment`,
      { comment },
      apiService.getAuthHeaders()
    );
  },

  async getBlogViews(id) {
    return await apiService.get(`/blogs/${id}/views`);
  },
};
