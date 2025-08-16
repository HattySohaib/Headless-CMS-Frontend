import { toast } from "react-toastify";
import { apiService } from "../services/apiService";

/**
 * API Key/Token-related API calls
 */
export const keyApi = {
  // Get current API key
  async getApiKey() {
    const res = await apiService.get("/token/", apiService.getAuthHeaders());
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Generate new API key
  async generateApiKey() {
    const res = await apiService.post(
      "/token/",
      null,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    else toast.success(res.message);
    return res.data;
  },

  // Revoke API key
  async revokeApiKey() {
    const res = await apiService.delete("/token/", apiService.getAuthHeaders());
    if (!res.success) toast.warn(res.message);
    else toast.success(res.message);
    return res;
  },
};
