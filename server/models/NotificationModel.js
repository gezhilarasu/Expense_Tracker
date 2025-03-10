const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  time: { type: String, required: true }, // Format: "HH:mm" (24-hour format)
});

module.exports = mongoose.model("Notification", NotificationSchema);
