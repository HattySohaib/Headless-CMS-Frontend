import { apiService } from "../services/apiService";

/**
 * API Key/Token-related API calls - Returns standardized response envelopes
 * UI components should handle success/error messaging
 */
export const keyApi = {
  // Get current API key
  async getApiKey() {
    return await apiService.get("/token/", apiService.getAuthHeaders());
  },

  // Generate new API key
  async generateApiKey() {
    return await apiService.post("/token/", null, apiService.getAuthHeaders());
  },

  // Revoke API key
  async revokeApiKey() {
    return await apiService.delete("/token/", apiService.getAuthHeaders());
  },
};
