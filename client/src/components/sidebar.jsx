import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import "./Sidebar.css";

const Sidebar = ({ isNavOpen, toggleNav, handleLogout }) => {
  const location = useLocation(); // Get current location

  return (
    <aside className={`sidebar ${isNavOpen ? "active" : ""}`}>
      <div className="logo">CoinCounter</div>
      <nav>
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              📊 Dash Board
            </Link>
          </li>
          <li>
            <Link
              to="/budget"
              className={location.pathname === "/budget" ? "active" : ""}
            >
              💰 Budget
            </Link>
          </li>
          <li>
            <Link
              to="/addexpense"
              className={location.pathname === "/addexpense" ? "active" : ""}
            >
              ➕ Add Expense
            </Link>
          </li>
          <li>
            <Link
              to="/report"
              className={location.pathname === "/report" ? "active" : ""}
            >
              📑 Report
            </Link>
          </li>
          <li>
            <Link
              to="/notification"
              className={location.pathname === "/notification" ? "active" : ""}
            >
              🔔 Notifications
            </Link>
          </li>

          <li onClick={handleLogout} className="logout">
            <Link to="">↩️ Logout</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
