import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./notification.css"; // Import CSS file

const Notification = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get userId and token from localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      console.log("Fetching notifications with token:", token);
      const response = await fetch("https://expense-tracker-x5i9.onrender.com/api/notification/getNotifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        console.log("Notifications received:", data);
        setNotifications(data.notifications || []);
      } else {
        // If not ok (e.g., 401, 500), set empty and optionally log error
        const errorData = await response.json();
        console.error("Server error:", errorData.error);
        setNotifications([]);
        if (response.status === 401) {
          // Handle unauthorized - token might be invalid
          alert("Your session has expired. Please login again.");
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications
  
  
  // Set a new notification
  const handleSetNotification = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    
    if (!email.trim() || !time.trim()) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      console.log("Setting notification:", { email, time });
      const response = await fetch("https://expense-tracker-x5i9.onrender.com/api/notification/addNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, time })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set notification");
      }

      // Clear form fields
      setEmail("");
      setTime("");

      // Add the new notification to state to avoid refetching
      if (data.notification) {
        setNotifications(prev => [...prev, data.notification]);
      } else {
        // If the server doesn't return the new notification, fetch all notifications
        fetchNotifications();
      }
      
      alert("Notification set successfully!");
    } catch (error) {
      console.error("Error setting notification:", error);
      alert(error.message || "An unexpected error occurred");
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (notificationId) => {
    if (!notificationId) {
      alert("Invalid notification ID");
      return;
    }

    try {
      const response = await fetch(`https://expense-tracker-x5i9.onrender.com/api/notification/deleteNotification/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete notification");
      }

      // Update state without refetching
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      alert("Notification deleted successfully!");
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert(error.message || "An unexpected error occurred");
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

        <form className="notification-container" onSubmit={handleSetNotification}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="time">Time</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <button type="submit">Set Notification</button>
        </form>

        <h3>Your Notifications</h3>
        {loading ? (
          <p>Loading notifications...</p>
        ) : (
          <ul className="notification-list">
            {notifications.length === 0 ? (
              <p>No notifications set.</p>
            ) : (
              notifications.map((notification) => (
                <li key={notification._id}>
                  <span>Email: {notification.email}</span>
                  <span>Time: {notification.time}</span>
                  <button onClick={() => handleDeleteNotification(notification._id)}>Delete</button>
                </li>
              ))
            )}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Notification;