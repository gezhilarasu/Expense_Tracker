import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("https://expense-tracker-x5i9.onrender.com/api/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/signup_complete');
      } else {
        setErrors((prev) => ({
          ...prev,
          apiError: data.message || 'An error occurred during signup'
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        apiError: 'Network error, please try again later'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (fieldId) => {
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
      inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="card-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join us today and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {errors.apiError && <div className="error-banner">{errors.apiError}</div>}

          <div className="form-group">
            <label htmlFor="name" className="input-label">Full Name</label>
            <div className="input-container">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              <span className="input-icon">👤</span>
            </div>
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              <span className="input-icon">✉️</span>
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Create a strong password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('password')}
                tabIndex="-1"
              >
                👁️
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
            <p className="password-hint">Must be at least 4 characters</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <div className="input-container">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                tabIndex="-1"
              >
                👁️
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className={`signup-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
