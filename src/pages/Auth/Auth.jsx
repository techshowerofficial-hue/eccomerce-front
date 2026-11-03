
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:4000";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/user/login" : "/api/user/register";

      const payload = isLogin
        ? {
            email: formData.email.trim(),
            password: formData.password,
          }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (!response.data.success) {
        setError(response.data.message || "Something went wrong.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("nile_customer", JSON.stringify(response.data.user));

      setSuccess(
        isLogin
          ? "Login successful! Redirecting..."
          : "Account created successfully!"
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin((previous) => !previous);
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">N</div>
          <h1>NILE</h1>
          <p>Your shopping destination</p>
        </div>

        <div className="auth-heading">
          <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
          <p>
            {isLogin
              ? "Sign in to continue shopping."
              : "Create your account to get started."}
          </p>
        </div>

        {error && <div className="auth-message auth-error">{error}</div>}
        {success && (
          <div className="auth-message auth-success">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required={!isLogin}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <div className="auth-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
              />

              <button
                type="button"
                className="auth-show-password"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required={!isLogin}
              />
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button type="button" onClick={switchMode}>
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>

        <p className="auth-footer">
          Secure shopping experience with Nile.
        </p>
      </div>
    </div>
  );
};

export default Auth;

