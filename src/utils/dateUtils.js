/**
 * Date formatting utilities
 */

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  const {
    includeTime = false,
    dateStyle = "medium", // "short", "medium", "long", "full"
    timeStyle = "short", // "short", "medium", "long"
    relative = false,
    locale = "en-US",
  } = options;

  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  // Return relative time if requested
  if (relative) {
    return getRelativeTime(dateObj);
  }

  // Format with Intl.DateTimeFormat
  const formatOptions = {};

  if (includeTime) {
    formatOptions.dateStyle = dateStyle;
    formatOptions.timeStyle = timeStyle;
  } else {
    formatOptions.dateStyle = dateStyle;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {Date} date - The date to get relative time for
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
  }
};

/**
 * Format date for blog posts (compact format)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatBlogDate = (date) => {
  return formatDate(date, {
    dateStyle: "medium",
    relative: false,
  });
};

/**
 * Format date with time (for detailed views)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string with time
 */
export const formatDateTime = (date) => {
  return formatDate(date, {
    includeTime: true,
    dateStyle: "short",
    timeStyle: "short",
  });
};

/**
 * Format date for table/list views (compact)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatTableDate = (date) => {
  const now = new Date();
  const dateObj = new Date(date);
  const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));

  // Show relative time for recent dates, absolute for older ones
  if (diffInDays < 7) {
    return getRelativeTime(dateObj);
  } else {
    return formatDate(date, { dateStyle: "short" });
  }
};
