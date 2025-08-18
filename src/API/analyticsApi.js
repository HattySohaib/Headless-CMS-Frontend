import { apiService } from "../services/apiService";

/**
 * Analytics-related API calls - Returns standardized response envelopes
 * UI components should handle success/error messaging
 */
export const analyticsApi = {
  // Get daily view counts for the last 30 days (for StatCard)
  async getDailyViews30Days() {
    return await apiService.get(
      `/analytics/daily-views?days=30`,
      apiService.getAuthHeaders()
    );
  },

  // Get detailed views with timestamps for the last 7 days (for blog-specific analysis)
  async getDetailedViews7Days() {
    return await apiService.get(
      `/analytics/detailed-views?days=7`,
      apiService.getAuthHeaders()
    );
  },

  // Get quarterly view distribution (4 numbers)
  async getQuarterlyViews() {
    return await apiService.get(
      `/analytics/quarterly-views`,
      apiService.getAuthHeaders()
    );
  },

  // Get message statistics
  async getMessageStats() {
    return await apiService.get(
      "/analytics/messages",
      apiService.getAuthHeaders()
    );
  },

  async getDailyLikes() {
    return await apiService.get(
      `/analytics/daily-likes`,
      apiService.getAuthHeaders()
    );
  },
};
