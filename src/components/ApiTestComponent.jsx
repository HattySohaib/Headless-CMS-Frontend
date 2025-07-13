import React from "react";
import { apiService } from "../services/apiService";
import config from "../config/appConfig";

/**
 * Test component to verify API configuration
 * This can be temporarily added to your app to test the setup
 */
const ApiTestComponent = () => {
  const testApiConnection = async () => {
    try {
      console.log("Current API Base URL:", config.apiBaseUrl);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Is Development:", config.isDevelopment);

      // Test a simple API call (adjust endpoint as needed)
      const response = await apiService.get("/health");
      console.log("API Response:", response);
    } catch (error) {
      console.error("API Test Failed:", error.message);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>API Configuration Test</h3>
      <p>
        <strong>API Base URL:</strong> {config.apiBaseUrl}
      </p>
      <p>
        <strong>Environment:</strong> {process.env.NODE_ENV}
      </p>
      <p>
        <strong>Is Development:</strong> {config.isDevelopment ? "Yes" : "No"}
      </p>
      <button onClick={testApiConnection}>Test API Connection</button>
      <p>
        <small>Check console for results</small>
      </p>
    </div>
  );
};

export default ApiTestComponent;
