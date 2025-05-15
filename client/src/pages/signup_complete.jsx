import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Import navigate
import './signup_complete.css';

const SignupComplete = () => {
  const [email, setEmail] = useState('');
  const [created_otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setOtp(value);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !created_otp) {
      setErrorMessage('Please enter both email and verification code');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (created_otp.length < 6) {
      setErrorMessage('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://expense-tracker-x5i9.onrender.com/api/auth/signup/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, otp:created_otp }),
      });
      const data = await response.json();

      if (response.ok) {
        
         navigate('/login'); // Redirect to login page on success
        
      } else {
        setErrorMessage(data.message || 'Verification failed. Please try again.');
      }

    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-complete-container">
      <div className="signup-complete-card">
        <div className="card-content">
          <h1 className="title">Email Verification</h1>
          <p className="subtitle">Enter your email and the verification code sent to your Gmail</p>

          <form onSubmit={handleSubmit} className="verification-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your.email@gmail.com"
                className="form-input email-input"
                disabled={isLoading}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="otp" className="input-label">Verification Code</label>
              <input
                id="otp"
                type="text"
                value={created_otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit code"
                className="form-input otp-input"
                maxLength="6"
                disabled={isLoading}
                required
              />
              <p className="input-hint">Enter the 6-digit code sent to your Gmail</p>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupComplete;
