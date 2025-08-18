import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";

/**
 * Message-related API calls - Returns standardized response envelopes
 * UI components should handle success/error messaging
 */
export const messageApi = {
  // Get messages for the authenticated user with pagination, search, and filters
  getMessages: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    return await apiService.get(
      `/messages?${queryString}`,
      apiService.getAuthHeaders()
    );
  },

  // Get unread message count
  getUnreadCount: async () => {
    return await apiService.get(
      "/messages/unread",
      apiService.getAuthHeaders()
    );
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    return await apiService.patch(
      `/messages/${messageId}`,
      { read: true },
      apiService.getAuthHeaders()
    );
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    return await apiService.delete(
      `/messages/${messageId}`,
      apiService.getAuthHeaders()
    );
  },

  // Send a message (public route using API key)
  sendMessage: async (messageData) => {
    return await apiService.post("/messages", messageData);
  },
};
