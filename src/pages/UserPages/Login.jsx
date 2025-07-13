import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import Footer from "../../components/Footer/Footer";
import { apiService } from "../../services/apiService";

import { RiEyeFill, RiEyeOffFill } from "@remixicon/react";

const Login = () => {
  const { login } = useAuthContext();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (prev) => {
    setShowPassword(!prev);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await apiService.post("/users/login", formData);
      setSuccess("Login successful!");
      setError(null);

      login(result);
      setTimeout(() => navigate("/playground/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred");
    }
  };

  return (
    <>
      <div className={`login-container user-page-${theme}`}>
        <div className="form-left">
          <h2>Login</h2>
          <p className="subtext">Login with your credentials.</p>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </label>
            <label>
              Password
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                id="eye-btn"
                onClick={() => togglePasswordVisibility(showPassword)}
              >
                {!showPassword ? (
                  <RiEyeOffFill size={20} color="white" />
                ) : (
                  <RiEyeFill size={20} color="white" />
                )}
              </button>
            </label>
            <Link className="forgot">Forgot Password?</Link>
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="form-right">
          <Link to={"/signup"} className="new">
            New to Bloggest? <span> Sign Up here.</span>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
