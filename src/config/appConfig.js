/**
 * Application configuration
 * This file demonstrates how to use environment variables
 */

const config = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "/api",

  // Environment-specific settings
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Debug settings
  debugMode: process.env.NODE_ENV === "development",

  // Other app-specific configurations can go here
  appName: "Bloggest",
  version: "1.0.0",
};

export default config;
