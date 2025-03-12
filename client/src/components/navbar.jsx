import React, { useState } from 'react';
import './navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <h2 className="logo">My Website</h2>

            {/* Hamburger Menu Icon */}
            <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </div>

            {/* Navigation Links */}
            <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
