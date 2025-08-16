import React, { useState } from "react";
import "./UserPages.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/Footer/Footer";
import { useTheme } from "../../contexts/theme";
import {
  RiAccountCircleFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiEyeFill,
  RiEyeOffFill,
} from "@remixicon/react";
import { userApi } from "../../API/userApi";

const Signup = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    profileImage: null,
  });

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasCapital, setHasCapital] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);

  const togglePasswordVisibility = (prev) => {
    setShowPassword(!prev);
  };

  const updateConditions = (password) => {
    setHasMinLength(password.length >= 8);
    setHasNumber(/\d/.test(password));
    setHasCapital(/[A-Z]/.test(password));
    setHasSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };

  const [message, setMessage] = useState("");

  const checkUsername = async () => {
    if (!formData.username) return false;
    const available = await userApi.checkUserExists({
      username: formData.username,
    });
    return available;
  };

  const handleNext = () => {
    if (!formData.email) toast.warn("Please enter your email");
    else if (!formData.fullName) toast.warn("Please enter your full name");
    else setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
    console.log(formData.profileImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsernameChange = (e) => {
    const isAvailable = checkUsername();
    const { value } = e.target;
    if (!isAvailable) {
      setMessage("Username already taken");
    } else {
      setMessage("Username available");
    }
    setFormData({ ...formData, username: value });
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    updateConditions(value);
    setFormData({ ...formData, password: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profileImage) {
      toast.warn("Please upload a profile image");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("profileImage", formData.profileImage);

    const res = await userApi.signup(formDataToSend);
    if (res.success) setTimeout(() => navigate("/login"), 1000);
    setLoading(false);
  };

  return (
    <>
      <div className={`signup-container user-page-${theme}`}>
        <div className="form-left">
          <Link to={"/login"} className="new">
            Already have an account? <span> Login here.</span>
          </Link>
        </div>
        <div className="form-right">
          <h2 className="signup-title">Sign Up</h2>
          <p className="subtext">Create Your Account</p>
          <form onSubmit={handleSubmit} className="signup-form">
            {step === 1 && (
              <>
                <label className="signup-label">
                  Full Name
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
                <label className="signup-label">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="signup-input"
                    required
                  />
                </label>
              </>
            )}
            {step === 2 && (
              <>
                <label className="signup-label">
                  Username
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleUsernameChange}
                    className="signup-input"
                    required
                  />
                  {message && formData.username && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 0",
                        gap: "5px",
                      }}
                    >
                      {message === "Username already taken" ? (
                        <RiCloseCircleFill size={20} color="red" />
                      ) : (
                        <RiCheckboxCircleFill size={20} color="green" />
                      )}
                      <p>{message}</p>
                    </div>
                  )}
                </label>
                <label className="signup-label">
                  Password
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="signup-input"
                    required
                  />
                  <button
                    type="button"
                    id="eye-btn"
                    onClick={() => togglePasswordVisibility(showPassword)}
                  >
                    {!showPassword ? (
                      <RiEyeOffFill
                        size={20}
                        color={theme === "dark" ? "white" : "black"}
                      />
                    ) : (
                      <RiEyeFill
                        size={20}
                        color={theme === "dark" ? "white" : "black"}
                      />
                    )}
                  </button>
                </label>
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
              </>
            )}

            {step === 3 && (
              <>
                <label id="profile-label">
                  <RiAccountCircleFill size={75} />
                  {formData.profileImage ? (
                    formData.profileImage.name
                  ) : (
                    <span>Add Profile Picture</span>
                  )}
                  <input
                    hidden="true"
                    type="file"
                    name="profileImage"
                    onChange={handleFileChange}
                    className="signup-file-input"
                  />
                </label>

                <label>
                  Bio:
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="signup-textarea"
                  ></textarea>
                </label>

                <button
                  type="submit"
                  className="signup-button"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </>
            )}
          </form>
          <div className="step-btns">
            <button disabled={step === 1} onClick={handleBack}>
              Back
            </button>
            <button disabled={step === 3} onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
