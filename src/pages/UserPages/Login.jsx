import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import Footer from "../../components/Footer/Footer";

import { RiEyeFill, RiEyeOffFill } from "@remixicon/react";
import { userApi } from "../../API/userApi";
import Loader from "../../components/Loader/Loader";

const Login = () => {
  const { login } = useAuthContext();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (prev) => {
    setShowPassword(!prev);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await userApi.login(formData);
    if (res.success) {
      login(res.data);
      setTimeout(() => navigate("/playground/dashboard"), 500);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className={`login-container user-page-${theme}`}>
        <div className="form-left">
          <h2>Login</h2>
          <p className="subtext">Login with your credentials.</p>
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
            <Link className="forgot">Forgot Password?</Link>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
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
