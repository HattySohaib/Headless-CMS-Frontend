import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "../../contexts/auth";
import "./AuthorProfile.css";
import { useTheme } from "../../contexts/theme";
import { toast } from "react-toastify";

import {
  RiFileImageFill,
  RiCloseCircleFill,
  RiCheckboxCircleFill,
} from "@remixicon/react";
import { userApi } from "../../API/userApi";
import Loader from "../../components/Loader/Loader";
import GhostLoader from "../../components/GhostLoader/GhostLoader";

function AuthorProfile() {
  const { user } = useAuthContext();
  const [newDp, setNewDp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [message, setMessage] = useState("");
  const [inputsDisabled, setInputsDisabled] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Track the original username to check if it was changed
  const originalUsernameRef = useRef("");
  // Store timeout ID for cleanup
  const debounceTimerRef = useRef(null);

  const { theme } = useTheme();

  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    profileImageUrl: "",
    email: "",
    bio: "",
  });

  const toggleInputs = () => {
    setInputsDisabled(!inputsDisabled);
  };

  const handleGetUserByID = async () => {
    setImageLoaded(false); // Reset image loaded state when fetching new data
    const response = await userApi.getUser(user.id);
    if (response.success) {
      setUserData(response.data);
    }
    setLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    handleGetUserByID();
  }, [inputsDisabled]);

  // Store original username when user data is fetched
  useEffect(() => {
    if (userData.username) {
      originalUsernameRef.current = userData.username;
      // Username is initially valid if it's the user's current username
      setIsAvailable(true);
    }
  }, [userData.username]);

  // Clean up effect
  useEffect(() => {
    return () => {
      // Clean up any pending requests or timeouts
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    setNewDp(e.target.files[0]);
    setImageLoaded(false); // Reset image loaded state when new file is selected
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Debounced username check function
  const debouncedCheckUsername = useCallback((value) => {
    // Clear any pending timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't check if username is unchanged from original
    if (value === originalUsernameRef.current) {
      setIsAvailable(true);
      setMessage("");
      setIsCheckingUsername(false);
      return;
    }

    if (!value) {
      setIsAvailable(false);
      setMessage("");
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    setMessage("Checking username...");

    // Set new timeout
    debounceTimerRef.current = setTimeout(async () => {
      const response = await userApi.checkUsername(value);
      if (response.success) {
        setIsAvailable(response.data);
        console.log("Username availability checked:", response.data);
        setMessage(
          response.data ? "Username available" : "Username already taken"
        );
      } else {
        setIsAvailable(false);
        setMessage("Error checking username");
      }
      setIsCheckingUsername(false);
    }, 500); // 500ms debounce delay
  }, []);

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
    debouncedCheckUsername(value);
    console.log("Checking username:", value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", userData.fullName);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("bio", userData.bio);
    if (newDp) {
      formData.append("profileImage", newDp);
    }
    const response = await userApi.updateProfile(user.id, formData);
    if (response.success) {
      setInputsDisabled(true);
      handleGetUserByID(user.id);
    }
    // Error handling is done by apiService centrally
  };

  if (loading) return <Loader />;
  return (
    <div className={`edit-profile-${theme} edit`}>
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2 className="form-header">Hi, {userData.fullName.split(" ")[0]}</h2>
        <div className="form-group dp-holder">
          <label htmlFor="profileImageUrl">
            {!inputsDisabled && !newDp && (
              <div className="img-overlay">
                <RiFileImageFill color="white" />
              </div>
            )}
            <div style={{ position: "relative" }}>
              {!imageLoaded && (
                <GhostLoader width={"8rem"} height={"8rem"} radius={"50%"} />
              )}
              <img
                className="profile-picture"
                src={
                  newDp ? URL.createObjectURL(newDp) : userData.profileImageUrl
                }
                alt={userData.username}
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? "block" : "none" }}
              />
            </div>
          </label>
          <input
            disabled={inputsDisabled}
            style={{ display: "none" }}
            type="file"
            id="profileImageUrl"
            name="profileImageUrl"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            disabled={true}
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="username">Full name</label>
          <input
            disabled={inputsDisabled}
            type="text"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            disabled={inputsDisabled}
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleUsernameChange}
            required
          />
          {message && !inputsDisabled && userData.username && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 0",
                gap: "5px",
              }}
            >
              {isCheckingUsername ? (
                <span className="spinner-small"></span>
              ) : message === "Username already taken" ? (
                <RiCloseCircleFill size={20} color="red" />
              ) : (
                <RiCheckboxCircleFill size={20} color="green" />
              )}
              <p>{message}</p>
            </div>
          )}
        </div>

        <div className="form-group bio-form">
          <label htmlFor="bio">Bio</label>
          <textarea
            disabled={inputsDisabled}
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        {inputsDisabled && (
          <button className="float-btns edit-btn" onClick={toggleInputs}>
            Edit
          </button>
        )}
        {!inputsDisabled && (
          <div className="float-btns">
            <button
              className="submit-btn"
              type="submit"
              disabled={!isAvailable || isCheckingUsername}
              title={!isAvailable ? "Please choose an available username" : ""}
            >
              Save Changes
            </button>
            <button className="cancel-btn" onClick={toggleInputs}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default AuthorProfile;
