const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://exptr.vercel.app", // local and deployed frontend
    "https://expense-tracker-6y1a.vercel.app"// (optional, if you want to allow backend self-origin)
  ],
  credentials: true,
}));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const {initScheduler}=require('./services/notificationscheduler');


app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/notification", notificationRoutes);

initScheduler();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
