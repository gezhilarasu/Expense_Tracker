import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./notification.css"; // Import CSS file

const Notification = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
};
  useEffect(() => {
          const handleClickOutside = (event) => {
              if (isNavOpen && !event.target.closest(".sidebar") && !event.target.closest(".menu-icon")) {
                  setIsNavOpen(false);
              }
          };
  
          if (isNavOpen) {
              document.addEventListener("click", handleClickOutside);
          } else {
              document.removeEventListener("click", handleClickOutside);
          }
  
          return () => {
              document.removeEventListener("click", handleClickOutside);
          };
      }, [isNavOpen]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notification/all/${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Set a new notification
  const handleSetNotification = async () => {
    try {
      await axios.post("http://localhost:5000/api/notification/set", {
        userId,
        email,
        time,
      });
      fetchNotifications(); // Refresh notifications
      alert("Notification set successfully!");
    } catch (error) {
      console.error("Error setting notification:", error);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notification/delete/${notificationId}`);
      fetchNotifications(); // Refresh notifications
      alert("Notification deleted successfully!");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    
    <div className="notification">
      <Sidebar isNavOpen={isNavOpen} toggleNav={toggleNav} handleLogout={handleLogout} />
      <main className="budget-content">
                <header className="header">
                    <div className="menu-icon" onClick={toggleNav}>☰</div>
                    <div>Set Notifications</div>
                </header>
      
      <h2>Set Budget Reminders</h2>

      <div className="notification-container">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Time</label>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button class="note-button"onClick={handleSetNotification}>Set Notification</button>
      </div>

      <h3>Your Notifications</h3>
      <ul className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications set.</p>
        ) : (
          notifications.map((notification) => (
            <li key={notification._id}>
              <span>{notification.time}</span>
              <button class="note-button" onClick={() => handleDeleteNotification(notification._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
      </main>
    </div>
  );
};

export default Notification;
