import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://expense-tracker-x5i9.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store user ID in localStorage
        localStorage.setItem("token", data.token);
        const expiresIn = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
        localStorage.setItem('expiresAt', Date.now() + expiresIn);
        navigate("/dashboard"); // Redirect after login
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. No account found.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/send-otp"); // Navigate to the send-otp page
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sign In to Your Account</h1>
          <p className="login-subtitle">Track your expenses, save money</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="forgot-password-container">
            <button 
              type="button" 
              className="forgot-password-link" 
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;