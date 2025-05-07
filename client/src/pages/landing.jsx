import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./landing.css";
// Note: You'll need to replace with an actual expense tracker related image
// import landingImage from "../assets/expense_tracker_dashboard.jpg";

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
    <div className="landing-page">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <h1>COINCOUNTER</h1>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776;
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          
          <li className="login-btn">
            <Link to="/login">Login</Link>
          </li>
          <li className="get-started-btn">
            <Link to="/signup">Sign Up Free</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <h1>Take Control of Your <span className="highlight">Financial Future</span></h1>
          <p className="hero-subtitle">
            Smart expense tracking that helps you save more, spend wisely, and achieve your financial goals.
          </p>
          <div className="cta-buttons">
            <button className="primary-btn">
              <Link to="/signup">Start For Free</Link>
            </button>
          </div>
          <div className="statistics">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8</span>
              <span className="stat-label">App Rating</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">35%</span>
              <span className="stat-label">Average Savings</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1826&q=80" alt="Financial Dashboard" />          {/* Replace with: <img src={landingImage} alt="CoinCounter Dashboard" /> */}
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Users Love CoinCounter</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Intelligent Dashboard</h3>
            <p>Get a comprehensive view of your finances with customizable charts and real-time updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Stay on track with bill reminders and alerts when you're approaching budget limits.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Bank-Level Security</h3>
            <p>Rest easy knowing your financial data is protected with top-tier encryption.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Goal Tracking</h3>
            <p>Set financial goals and track your progress with visual indicators and milestone celebrations.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How CoinCounter Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Accounts</h3>
            <p>Securely link your bank accounts, credit cards, and other financial services in minutes.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Categorize Expenses</h3>
            <p>Our AI automatically categorizes your transactions, or customize categories to match your lifestyle.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Set Budgets</h3>
            <p>Create monthly or custom period budgets for different spending categories.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track & Optimize</h3>
            <p>Monitor your spending habits and receive personalized tips to improve your financial health.</p>
          </div>
        </div>
      </section>
      
      

      {/* Final CTA Section */}
      <section className="final-cta">
        <h2>Ready to Master Your Finances?</h2>
        <p>Join thousands of users who have transformed their financial future with CoinCounter.</p>
        <button className="primary-btn large">
          <Link to="/signup">Start Your Free Trial Today</Link>
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">💰</span>
            <h3>COINCOUNTER</h3>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/download">Download App</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/security">Security</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CoinCounter. All rights reserved.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;