import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { useTheme } from "../../contexts/theme";
import { keyApi } from "../../API/keyApi";
import { toast } from "react-toastify";
import { truncate } from "../../utils/stringFunctions";

import "./AccessToken.css";
import {
  RiCheckDoubleFill,
  RiClipboardFill,
  RiEyeFill,
  RiEyeOffFill,
} from "@remixicon/react";

const ApiKeyPage = () => {
  const [apiKey, setApiKey] = useState("Not Generated");
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedAPI, setCopiedAPI] = useState(false);

  const { theme } = useTheme();

  const handleGetApiKey = async () => {
    setLoading(true);
    const data = await keyApi.getApiKey();
    setApiKey(data.apiKey);
    setLoading(false);
  };

  useEffect(() => {
    handleGetApiKey();
  }, []);

  const handleGenerateApiKey = async () => {
    setLoading(true);
    const data = await keyApi.generateApiKey();
    setApiKey(data.apiKey);
    setLoading(false);
  };

  const handleRevokeApiKey = async () => {
    setLoading(true);
    await keyApi.revokeApiKey();
    setApiKey("Not Generated");
    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAPI(true);
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
          <div className="api-value-container">
            <p className="api-value">
              {showApiKey
                ? apiKey
                : apiKey === "Not Generated"
                ? "Not Generated"
                : "•••••••••••••••••••••••••••••••••••••••••••••••"}
            </p>
            {apiKey !== "Not Generated" && (
              <div className="key-opt-btns">
                <button
                  className="key-opt-btn"
                  onClick={() => setShowApiKey((prev) => !prev)}
                >
                  {showApiKey ? (
                    <RiEyeOffFill size={20} color="#7d7d7d" />
                  ) : (
                    <RiEyeFill size={20} color="#7d7d7d" />
                  )}
                </button>
                <button
                  className="key-opt-btn"
                  onClick={() => handleCopy(apiKey)}
                >
                  {copiedAPI ? (
                    <RiCheckDoubleFill size={20} color="#7d7d7d" />
                  ) : (
                    <RiClipboardFill size={20} color="#7d7d7d" />
                  )}
                </button>
              </div>
            )}
          </div>
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
      </div>
    </div>
  );
};

export default ApiKeyPage;
