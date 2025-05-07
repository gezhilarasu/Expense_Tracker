// controllers/notificationController.js
const Notification = require("../models/NotificationModel");

const setNotification = async (req, res) => {
  const { email, time } = req.body;
  const userId = req.user?.id;

  if (!userId || !email || !time) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const notification = await Notification.create({ userId, email, time });
    res.status(200).json({ message: "Notification scheduled successfully!", notification });
  } catch (error) {
    console.error("Error setting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNotifications = async (req, res) => {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
  
    try {
      const notifications = await Notification.find({ userId });
      res.status(200).json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  

const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully!" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  setNotification,
  getNotifications,
  deleteNotification,
};
