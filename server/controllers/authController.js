const User = require("../models/user");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); // Import UUID


const SECRET_KEY = "your_secret_key"; // Use environment variables for security

// User Signup
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email });

      const userId = uuidv4();

  
      if (existingUser) {
        // If user exists, compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Email already registered. Incorrect password." });
        }
        // If password matches, treat this like a successful "login"
        return res
          .status(200)
          .json({ message: "Welcome back! Redirecting to dashboard..." });
      }
  
      // If no user found, create a new one
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ userId, name, email, password: hashedPassword });
      await newUser.save();
  
      return res.status(201).json({newUser:newUser, message: "User created successfully." });
    } catch (error) {
      console.error("Error during signup:", error);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
};


// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Account not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // ✅ Include userId in response
    res.status(200).json({ 
      message: "Login successful.", 
      user: { id: user.userId, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
