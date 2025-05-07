import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./resetpassword.css";

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      // If no email found, redirect to send-otp page
      navigate("/send-otp");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response1 = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email, created_otp: otp }), // Fix: use otp variable
      });

      const data1 = await response1.json(); // Fix: get JSON from response

      if (response1.ok) { // Fix: use response1 instead of response
        const response2 = await fetch("http://localhost:5000/api/auth/resetpassword", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, newpassword: newPassword }), // Fix: match backend parameter name
        });

        const data2 = await response2.json(); // Fix: get JSON from response

        if(response2.ok) {
            setMessage("Password reset successfully!");
            sessionStorage.removeItem("resetEmail");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } else {
            setError(data2.message || "Password is not reset"); // Fix: use data2
        }
      } else {
        setError(data1.message || "OTP is not valid"); // Fix: use data1
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    navigate("/send-otp");
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p className="reset-password-subtitle">
            Enter the verification code sent to your email and create a new password
          </p>
          {email && (
            <p className="email-info">
              Email: <span>{email}</span>
            </p>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="otp">Verification Code:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="form-control"
              placeholder="Enter the 6-digit code"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Enter new password"
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Confirm new password"
              disabled={loading}
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="reset-password-button"
            disabled={loading}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>

          <div className="action-links">
            <button
              type="button"
              className="resend-otp-link"
              onClick={handleResendOtp}
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;