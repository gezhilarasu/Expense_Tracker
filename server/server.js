const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const budgetRoutes = require("./routes/budgetRoutes");
app.use("/api/budget", budgetRoutes);

const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expense", expenseRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notification", notificationRoutes);

const Notification = require("./models/NotificationModel");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Schedule Notifications
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const notifications = await Notification.find({ time: currentTime });

    for (const notification of notifications) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: notification.email,
        subject: "Budget Reminder",
        text: "It's time to update your budget! Log in and update your details.",
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${notification.email}`);
    }
  } catch (error) {
    console.error("Error sending email notifications:", error);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
