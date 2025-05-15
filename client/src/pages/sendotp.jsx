import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sendotp.css";

function SendOTP() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("https://expense-tracker-x5i9.onrender.com/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP sent successfully! Please check your email.");
        // Store email in session storage to use in reset password page
        sessionStorage.setItem("resetEmail", email);
        
        // Navigate to reset password page after 2 seconds
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="send-otp-container">
      <div className="send-otp-card">
        <div className="send-otp-header">
          <h1>Forgot Password</h1>
          <p className="send-otp-subtitle">
            Enter your email address to receive a verification code
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="send-otp-form">
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              placeholder="Enter your registered email"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="send-otp-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>

          <button
            type="button"
            className="back-to-login-button"
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendOTP;