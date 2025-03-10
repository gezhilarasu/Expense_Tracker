import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import landingImage from "../assets/landing_3.jpg";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".navbar")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div>
      {/* Navbar Section */}
      <nav className="navbar">
        <h1>COINCOUNTER</h1>
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776;
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          
          <li className="get-started-btn-1">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>

      <div className="landing-container">
        {/* Left Section - Website Info */}
        <div className="text-section">
          <h1>Master Your Finances with Ease</h1>
          <p>
            Effortlessly track your expenses, analyze your spending habits, and 
            take full control of your budget with CoinCounter.
          </p>
          <ul className="features-list">
            <li>
              ✅ <strong>Real-time Tracking</strong> – See your expenses as they happen.
            </li>
            <li>
              📊 <strong>Budget Insights</strong> – AI-powered insights on where to save.
            </li>
            <li>
              🔔 <strong>Custom Notifications</strong> – Get reminders to stay on track.
            </li>
            <li>
              🌍 <strong>Multi-Device Access</strong> – Sync data across all devices.
            </li>
          </ul>
          <button className="get-started-btn">
            <Link to="/signup" className="sign-btn">Get Started</Link>
          </button>
        </div>

        {/* Right Section - Image */}
        <div className="image-section">
          <img src={landingImage} alt="Expense Tracking" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
