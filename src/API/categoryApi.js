import { apiService } from "../services/apiService";

/**
 * Category-related API calls - Returns standardized response envelopes
 * UI components should handle success/error messaging
 */
export const categoryApi = {
  // Get all categories
  async getCategories() {
    return await apiService.get("/categories");
  },

  // Create new category
  async createCategory(category) {
    return await apiService.post(
      "/categories",
      category,
      apiService.getAuthHeaders()
    );
  },

  // Update category
  async updateCategory(id, categoryBody) {
    return await apiService.patch(
      `/categories/${id}`,
      categoryBody,
      apiService.getAuthHeaders()
    );
  },

  // Delete category
  async deleteCategory(id) {
    return await apiService.delete(
      `/categories/${id}`,
      apiService.getAuthHeaders()
    );
  },
};
