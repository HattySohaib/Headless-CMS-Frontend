import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";

/**
 * Category-related API calls
 */
export const categoryApi = {
  // Get all categories
  async getCategories(filters = {}) {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `/categories?${queryString}` : "/categories";
    const res = await apiService.get(endpoint, apiService.getAuthHeaders());
    return res.data;
  },

  // Get single category
  async getCategory(id) {
    const res = await apiService.get(
      `/categories/${id}`,
      apiService.getAuthHeaders()
    );
    return res.data;
  },

  // Create new category
  async createCategory(category) {
    console.log("Creating category:", category);
    return apiService.post(
      "/categories",
      category,
      apiService.getAuthHeaders()
    );
  },

  // Update category
  async updateCategory(id, categoryBody) {
    return apiService.patch(
      `/categories/${id}`,
      categoryBody,
      apiService.getAuthHeaders()
    );
  },

  // Delete category
  async deleteCategory(id) {
    return apiService.delete(`/categories/${id}`, apiService.getAuthHeaders());
  },
};
