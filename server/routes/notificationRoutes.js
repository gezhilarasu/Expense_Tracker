const express = require("express");
const Notification = require("../models/NotificationModel");
const router = express.Router();

// Set a new notification (Multiple allowed)
router.post("/set", async (req, res) => {
  try {
    const { userId, email, time } = req.body;
    if (!userId || !email || !time) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    await Notification.create({ userId, email, time });
    res.status(200).json({ message: "Notification scheduled successfully!" });
  } catch (error) {
    console.error("Error setting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all notifications for a user
router.get("/all/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific notification
router.delete("/delete/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully!" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
