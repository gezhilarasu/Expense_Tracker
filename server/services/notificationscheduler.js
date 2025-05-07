const cron = require("node-cron");
const Notification = require("../models/NotificationModel");
const sendMail = require("../utils/sendmail"); // Correct import

// Check and send scheduled notifications
const checkScheduledNotifications = async () => {
  try {
    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-GB", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    const notifications = await Notification.find({ time: currentTime });
    
    if (notifications.length > 0) {
      console.log(`🔔 Found ${notifications.length} notifications scheduled for ${currentTime}`);
      
      for (const notification of notifications) {
        try {
          await sendMail(
            notification.email,
            "Budget Reminder",
            "It's time to update your budget! Log in and update your details."
          );
          console.log(`✉️ Email sent to ${notification.email}`);
        } catch (error) {
          console.error(`❌ Error sending email to ${notification.email}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error processing scheduled notifications:", error);
  }
};

// Initialize the notification scheduler
const initScheduler = () => {
  console.log("⏰ Initializing notification scheduler");
  
  // Run every minute
  cron.schedule("* * * * *", checkScheduledNotifications);
  
  return {
    checkScheduledNotifications
  };
};

module.exports = {
  initScheduler,
  checkScheduledNotifications
};