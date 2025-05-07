const express = require("express");
const router = express.Router();
const {register_initalize,register_complete,login,sentOtp,verifyOtp,resetpassword} = require("../controllers/authController");

// Signup route
router.post("/signup", register_initalize);
router.post("/signup/complete", register_complete);

// Login route
router.post("/login", login);

// Send OTP route
router.post("/send-otp", sentOtp);

// Verify OTP route
router.post("/verify-otp", verifyOtp);

// Reset password route
router.post("/resetpassword", resetpassword);

module.exports = router;
