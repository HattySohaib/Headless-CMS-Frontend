import { apiService } from "../services/apiService";
import { buildQueryString } from "../utils/buildQueryString";
import { toast } from "react-toastify";

export const messageApi = {
  // Get messages for the authenticated user with pagination, search, and filters
  getMessages: async (filters = {}) => {
    const queryString = buildQueryString(filters);
    const res = await apiService.get(
      `/messages?${queryString}`,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Get unread message count
  getUnreadCount: async () => {
    const res = await apiService.get(
      "/messages/unread",
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    const res = await apiService.patch(
      `/messages/${messageId}`,
      { read: true },
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    const res = await apiService.delete(
      `/messages/${messageId}`,
      apiService.getAuthHeaders()
    );
    if (!res.success) toast.warn(res.message);
    return res.data;
  },

  // Send a message (public route using API key)
  sendMessage: async (messageData) => {
    const res = await apiService.post("/messages", messageData);
    if (!res.success) toast.warn(res.message);
    return res.data;
  },
};
