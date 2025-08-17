import { apiService } from "../services/apiService";

/**
 * Category-related API calls
 */
export const categoryApi = {
  // Get all categories
  async getCategories() {
    const res = await apiService.get("/categories");
    return res.data;
  },

  // Create new category
  async createCategory(category) {
    const res = await apiService.post(
      "/categories",
      category,
      apiService.getAuthHeaders()
    );
    return res.data;
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
