import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useTheme } from "../../contexts/theme";
import { apiService } from "../../services/apiService";

import { truncate } from "../../utils/stringFunctions";

import "./AccessToken.css";
import {
  RiCheckDoubleFill,
  RiClipboardFill,
  RiEyeFill,
  RiEyeOffFill,
} from "@remixicon/react";

const AccessTokenPage = () => {
  const [apiKey, setApiKey] = useState("Not Generated");
  const [accessToken, setAccessToken] = useState("Not Generated");
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [copiedAPI, setCopiedAPI] = useState(false);
  const [copiedAccess, setCopiedAccess] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        setLoading(true);
        const data = await apiService.get(
          "/token/keys",
          apiService.getAuthHeaders()
        );
        setApiKey(data.apiKey);
        setAccessToken(data.accessToken);
      } catch (error) {
        toast.error("Error fetching API key and token.");
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, []);

  const handleGenerateApiKey = async () => {
    try {
      setLoading(true);
      const data = await apiService.post(
        "/token/generate-api-key",
        null,
        apiService.getAuthHeaders()
      );
      setApiKey(data.apiKey);
      toast.success("API key generated successfully!");
    } catch (error) {
      toast.error("Error generating API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAccessToken = async () => {
    try {
      setLoading(true);
      const data = await apiService.post(
        "/token/generate-access-token",
        null,
        apiService.getAuthHeaders()
      );
      setAccessToken(data.accessToken);
      toast.success("Access token generated successfully!");
    } catch (error) {
      toast.error("Error generating access token.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeApiKey = async () => {
    try {
      setLoading(true);
      await apiService.post(
        "/token/revoke-api-key",
        null,
        apiService.getAuthHeaders()
      );
      setApiKey("Not Generated");
      toast.success("API key revoked successfully!");
    } catch (error) {
      toast.error("Error revoking API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccessToken = async () => {
    try {
      setLoading(true);
      await apiService.post(
        "/token/revoke-access-token",
        null,
        apiService.getAuthHeaders()
      );
      setAccessToken("Not Generated");
      toast.success("Access token revoked successfully!");
    } catch (error) {
      toast.error("Error revoking access token.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    type === "api" ? setCopiedAPI(true) : setCopiedAccess(true);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="api-page" className={`api-page-${theme}`}>
      <div className="keys-section">
        <h3 className="key-header">API Key:</h3>
        <p className="key-desc">
          Use this key to make read-only requests for your blogs. This key will
          be used to identify which blogs to show you.
        </p>
        <div className="key-section">
          <p className="api-value">
            {showApiKey ? apiKey : truncate(apiKey, 70)}
          </p>
          {apiKey !== "Not Generated" && (
            <div className="key-opt-btns">
              <button
                className="key-opt-btn"
                onClick={() => setShowApiKey((prev) => !prev)}
              >
                {showApiKey ? (
                  <RiEyeFill size={20} color="#7d7d7d" />
                ) : (
                  <RiEyeOffFill size={20} color="#7d7d7d" />
                )}
              </button>
              <button
                className="key-opt-btn"
                onClick={() => handleCopy(apiKey, "api")}
              >
                {copiedAPI ? (
                  <RiCheckDoubleFill size={20} color="#7d7d7d" />
                ) : (
                  <RiClipboardFill size={20} color="#7d7d7d" />
                )}
              </button>
            </div>
          )}
          {apiKey === "Not Generated" && (
            <button
              className="key-btn"
              onClick={handleGenerateApiKey}
              disabled={loading}
            >
              Generate API Key
            </button>
          )}
          {apiKey !== "Not Generated" && (
            <button
              className="key-btn"
              onClick={handleRevokeApiKey}
              disabled={loading}
            >
              Revoke API Key
            </button>
          )}
        </div>
        <h3 className="key-header">Access Token:</h3>
        <p className="key-desc">
          Use this key to make write requests for your blogs. Keep this very
          safe or anyone can get full access to your blogs.
        </p>
        <div className="token-section">
          <p className="api-value">
            {showAccessToken ? accessToken : truncate(accessToken, 60)}
          </p>
          {accessToken !== "Not Generated" && (
            <div className="key-opt-btns">
              <button
                className="key-opt-btn"
                onClick={() => setShowAccessToken((prev) => !prev)}
              >
                {showAccessToken ? (
                  <RiEyeFill size={20} color="#7d7d7d" />
                ) : (
                  <RiEyeOffFill size={20} color="#7d7d7d" />
                )}
              </button>
              <button
                className="key-opt-btn"
                onClick={() => handleCopy(accessToken, "accessToken")}
              >
                {copiedAccess ? (
                  <RiCheckDoubleFill size={20} color="#7d7d7d" />
                ) : (
                  <RiClipboardFill size={20} color="#7d7d7d" />
                )}
              </button>
            </div>
          )}
          {accessToken === "Not Generated" && (
            <button
              className="key-btn"
              onClick={handleGenerateAccessToken}
              disabled={loading}
            >
              Generate Access Token
            </button>
          )}
          {accessToken !== "Not Generated" && (
            <button
              className="key-btn"
              onClick={handleRevokeAccessToken}
              disabled={loading}
            >
              Revoke Access Token
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessTokenPage;
