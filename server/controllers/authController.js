const User = require("../models/user");
const pendingUser = require("../models/pendinguser");
const bcrypt = require("bcrypt");
const sendMail=require('../utils/sendmail');

const verifiedOtp = new Set(); // Store verified OTPs in memory
const jwt = require("jsonwebtoken");


// User Signup
exports.register_initalize = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 4) {
    return res.status(400).json({ message: "All fields are required and password must be at least 4 characters." });
  }

  console.log("Received data:", { name, email, password });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingPendingUser = await pendingUser.findOne({ email });
    if (existingPendingUser) {
      return res.status(400).json({ message: "A verification is already in process. Please check your email for the OTP." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    const newUser = new pendingUser({
      name,
      email,
      password: hashedPassword,
      otp,
      otp_expiry: otpExpiry,
    });

    await newUser.save();
    console.log("Pending user saved:", newUser);

    const subject = "Account Verification";
    const text = `Hello ${name},\n\nPlease verify your account using the following OTP: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nThank you!`;

    try {
      await sendMail(email, subject, text);
      console.log("otp send successfully");
      res.status(201).json({ message: "OTP sent successfully. Please check your email." });
    } catch (emailError) {

      await pendingUser.findOneAndDelete({ email });
      console.error("Error sending email:", emailError);
      res.status(500).json({ message: "Failed to send verification email. Please try again.", error: emailError.message });
    }
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};


exports.register_complete = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    console.log(email,otp);
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    const pendingUserRecord = await pendingUser.findOne({ email });
    if (!pendingUserRecord) {
      return res.status(404).json({ message: "Pending user not found." });
    }

    // Check if OTP is valid and not expired
    if (pendingUserRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const now = new Date();
    if (now > pendingUserRecord.otp_expiry) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Create new user in the User collection
    const newUser = new User({
      name: pendingUserRecord.name,
      email: pendingUserRecord.email,
      password: pendingUserRecord.password
    });

    await newUser.save();
    console.log("New user created:", newUser);

    // Delete the pending user record
    await pendingUser.findOneAndDelete({ email });

    res.status(201).json({ message: "Account verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};



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
    const token=jwt.sign(
      {
      id:user._id,
      email:user.email,
      },
    process.env.JWT_SECRET,
    {expiresIn:'1h'},
  );

    // ✅ Include userId in response
    res.status(200).json({ 
      message: "Login successful.", 
      token,
      user: { id: user.userId, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


exports.sentOtp = async (req, res) => {
    const { email } = req.body;
    console.log('Sending OTP to:', email);
    
    try {
        const existsEmail = await User.findOne({ email });

        if (!existsEmail) {
            return res.status(400).json({ message: 'Email does not exist' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        existsEmail.otp = otp;
        existsEmail.otp_expiry = expiry;
        await existsEmail.save();
        console.log('Generated OTP:', otp);
        
        try {
            await sendMail(
                email, 
                'OTP verification', 
                `Your OTP is ${otp}. It will expire in 5 minutes.`
            );
            return res.status(200).json({ message: 'OTP sent successfully' });
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Rollback OTP changes if email fails
            existsEmail.otp = undefined;
            existsEmail.otp_expiry = undefined;
            await existsEmail.save();
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.verifyOtp =async(req,res)=>{
    const {email,created_otp}=req.body;

    try{

        const emailexists=await User.findOne({email});

        if(!emailexists || emailexists.otp !== created_otp || emailexists.otp_expiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        verifiedOtp.add(email);
        emailexists.opt=null;
        emailexists.opt_expiry=null;
        await emailexists.save();
        return res.status(200).json({message:'OTP verified successfully'});
    }
    catch(err)
        {
            return res.status(500).json({message:'Internal server error'});
        }
};

exports.resetpassword =async(req,res)=>{
    const {email,newpassword}=req.body;
    try{
        const emailexists=await verifiedOtp.has(email);
        if(!emailexists){
            return res.status(400).json({message:'Email does not exist'});
        }
        const hashedpassword=await bcrypt.hash(newpassword,10);
        const user=await User.findOne({email});
        user.password=hashedpassword;
        await user.save();
        verifiedOtp.delete(email);
        return res.status(200).json({message:'Password reset successfully'});
    }
    catch(err)
    {
        return res.status(500).json({message:'Internal server error'});
    }
};




