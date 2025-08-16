import { apiService } from "../services/apiService";
import { toast } from "react-toastify";

/**
 * Analytics-related API calls
 */
export const analyticsApi = {
  // Get daily view counts for the last 30 days (for StatCard)
  async getDailyViews30Days() {
    const res = await apiService.get(
      `/analytics/daily-views?days=30`,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Get detailed views with timestamps for the last 7 days (for blog-specific analysis)
  async getDetailedViews7Days() {
    const res = await apiService.get(
      `/analytics/detailed-views?days=7`,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Get quarterly view distribution (4 numbers)
  async getQuarterlyViews() {
    const res = await apiService.get(
      `/analytics/quarterly-views`,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Get message statistics
  async getMessageStats() {
    const res = await apiService.get(
      "/analytics/messages",
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },
};
