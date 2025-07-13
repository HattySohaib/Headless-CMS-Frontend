import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import "./AuthorProfile.css";
import { useTheme } from "../../contexts/theme";
import { apiService } from "../../services/apiService";

import { RiFileImageFill } from "@remixicon/react";

function AuthorProfile() {
  const { user } = useAuthContext();
  const [newDp, setNewDp] = useState(null);
  const [inputsDisabled, setInputsDisabled] = useState(true);

  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    bio: "",
  });
  const [dp, setDp] = useState("");

  const toggleInputs = () => {
    setInputsDisabled(!inputsDisabled);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await apiService.get(
          `/users/${user.id}`,
          apiService.getAuthHeaders(user.token)
        );
        setFormData({
          full_name: userData.full_name || "",
          username: userData.username || "",
          email: userData.email || "",
          bio: userData.bio || "",
        });
        setDp(userData.profile_image_url);
      } catch (err) {
        toast.error(err.message || "An error occurred");
      }
    };

    fetchUserData();
  }, [user, inputsDisabled]);

  const handleFileChange = (e) => {
    setNewDp(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (/\s/.test(formData.username)) {
      toast.error("Username should not contain spaces");
      return;
    }
    if (newDp) {
      formData.append({ profile_image_url: newDp });
    }
    try {
      const result = await apiService.post(
        `/users/${user.id}`,
        formData,
        apiService.getAuthHeaders(user.token)
      );
      console.log(result);
      setInputsDisabled(true);
      toast.success(result.message);
    } catch (err) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className={`edit-profile-${theme} edit`}>
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2 className="form-header">Hi, {formData.full_name.split(" ")[0]}</h2>
        <div className="form-group dp-holder">
          <label htmlFor="profile_image_url">
            {!inputsDisabled && (
              <div className="img-overlay">
                <RiFileImageFill color="white" />
              </div>
            )}
            <img className="profile-picture" src={dp} alt={formData.username} />
          </label>
          <input
            disabled={inputsDisabled}
            style={{ display: "none" }}
            type="file"
            id="profile_image_url"
            name="profile_image_url"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            disabled={true}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="username">Full name</label>
          <input
            disabled={inputsDisabled}
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
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
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group bio-form">
          <label htmlFor="bio">Bio</label>
          <textarea
            disabled={inputsDisabled}
            id="bio"
            name="bio"
            value={formData.bio}
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
            <button className="submit-btn" type="submit">
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
