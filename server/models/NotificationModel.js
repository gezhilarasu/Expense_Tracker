const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
