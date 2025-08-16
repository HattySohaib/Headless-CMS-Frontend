import { toast } from "react-toastify";
import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";

/**
 * Blog-related API calls
 */
export const blogApi = {
  // Get blogs with filtering and pagination
  async getBlogs(filters = {}) {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `/blogs?${queryString}` : "/blogs";
    const res = await apiService.get(endpoint, apiService.getAuthHeaders());
    return res.data;
  },

  // Get single blog
  async getBlog(id) {
    const res = await apiService.get(`/blogs/${id}`);
    return res.data;
  },

  // Create new blog
  async createBlog(blogData) {
    const res = await apiService.post(
      "/blogs",
      blogData,
      apiService.getAuthHeaders()
    );
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
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
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    console.log("Blog updated:", res);
    return res;
  },

  // Delete blog
  async deleteBlog(id) {
    const res = await apiService.delete(
      `/blogs/${id}`,
      apiService.getAuthHeaders(),
      true
    );
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    return res;
  },

  // Blog interactions
  async likeBlog(id) {
    return apiService.post(
      `/blogs/${id}/like`,
      {},
      apiService.getAuthHeaders()
    );
  },

  async commentOnBlog(id, comment) {
    return apiService.post(
      `/blogs/${id}/comment`,
      { comment },
      apiService.getAuthHeaders()
    );
  },

  async getBlogViews(id) {
    return apiService.get(`/blogs/${id}/views`);
  },
};
