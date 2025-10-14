import { toast } from "react-toastify";
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
    const res = await apiService.post(
      "/blogs",
      blogData,
      apiService.getAuthHeaders()
    );
    if (res.success) {
      toast.success("Blog created successfully!");
    }
    return res;
  },

  // Update blog
  async updateBlog(id, blogData) {
    const res = await apiService.patch(
      `/blogs/${id}`,
      blogData,
      apiService.getAuthHeaders()
    );
    if (res.success) {
      toast.success("Blog updated successfully!");
    }
    return res;
  },

  // Delete blog
  async deleteBlog(id) {
    const res = await apiService.delete(
      `/blogs/${id}`,
      apiService.getAuthHeaders()
    );
    if (res.success) {
      toast.success("Blog deleted successfully!");
    }
    return res;
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

  // Get trending blogs
  async getTrendingBlogs(limit = 15) {
    return await apiService.get(`/blogs/trending/today`);
  },
};
