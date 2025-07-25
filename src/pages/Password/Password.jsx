import React, { useState } from "react";
import { useAuthContext } from "../../contexts/auth.js";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/theme.js";
import { apiService } from "../../services/apiService";
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiEyeFill,
  RiEyeOffFill,
} from "@remixicon/react";

const PasswordUpdateForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const { theme } = useTheme();

  // States for tracking individual conditions
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasCapital, setHasCapital] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const updateConditions = (password) => {
    setHasMinLength(password.length >= 8);
    setHasNumber(/\d/.test(password));
    setHasCapital(/[A-Z]/.test(password));
    setHasSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };

  // Update the new password validation status when the new password changes
  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    updateConditions(newPassword); // Update conditions individually
    setPasswordsMatch(newPassword === confirmPassword);
  };

  // Update the confirm password field and check if passwords match
  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    setPasswordsMatch(newPassword === confirmPasswordValue);
  };

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !hasMinLength ||
      !hasCapital ||
      !hasNumber ||
      !hasSymbol ||
      !passwordsMatch
    )
      return;

    const formData = {
      oldPassword,
      newPassword,
    };

    try {
      const result = await apiService.post(
        `/users/edit-password/${user.id}`,
        formData,
        apiService.getAuthHeaders(user.token)
      );
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Error:", error);
    }
  };

  return (
    <div className={`edit-profile-${theme} edit`}>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="old-password">Old Password</label>
          <input
            type={showPassword.oldPassword ? "text" : "password"}
            id="old-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
            required
          />
          <button
            type="button"
            className="passwd-view-btn"
            onClick={() => togglePasswordVisibility("oldPassword")}
          >
            {!showPassword.oldPassword ? (
              <RiEyeOffFill color="white" />
            ) : (
              <RiEyeFill color="white" />
            )}
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <input
            type={showPassword.newPassword ? "text" : "password"}
            id="new-password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Enter your new password"
            required
          />
          <button
            type="button"
            className="passwd-view-btn"
            onClick={() => togglePasswordVisibility("newPassword")}
          >
            {!showPassword.newPassword ? (
              <RiEyeOffFill color="white" />
            ) : (
              <RiEyeFill color="white" />
            )}
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            id="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your new password"
            required
          />
          <button
            type="button"
            className="passwd-view-btn"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {!showPassword.confirmPassword ? (
              <RiEyeOffFill color="white" />
            ) : (
              <RiEyeFill color="white" />
            )}
          </button>
          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="error-message">Passwords do not match</p>
          )}
        </div>

        <div className="password-conditions">
          <div>
            {hasMinLength ? (
              <RiCheckboxCircleFill size={20} color="green" />
            ) : (
              <RiCloseCircleFill size={20} color="red" />
            )}
            <p className="condition">At least 8 characters</p>
          </div>
          <div>
            {hasNumber ? (
              <RiCheckboxCircleFill size={20} color="green" />
            ) : (
              <RiCloseCircleFill size={20} color="red" />
            )}
            <p className="condition">At least 1 number</p>
          </div>
          <div>
            {hasCapital ? (
              <RiCheckboxCircleFill size={20} color="green" />
            ) : (
              <RiCloseCircleFill size={20} color="red" />
            )}
            <p className="condition">At least 1 capital letter</p>
          </div>
          <div>
            {hasSymbol ? (
              <RiCheckboxCircleFill size={20} color="green" />
            ) : (
              <RiCloseCircleFill size={20} color="red" />
            )}
            <p className="condition">At least 1 symbol</p>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={
            !hasMinLength ||
            !hasCapital ||
            !hasNumber ||
            !hasSymbol ||
            !passwordsMatch
          }
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;
