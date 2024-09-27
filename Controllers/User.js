const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Models/User");
const UserOTPVerification = require("../Models/UserOTPVerification");
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

let Transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAILER,
        pass: process.env.password,
    },
  });

  //login and Sigun up function
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Sign up function
const signup = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    console.log(fullName,email)
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists",
          success:false
         });
    }
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
        name: fullName,
        email,
        password: hashedPassword,
        user_type: "buyer",
    });
    
    await user.save();

    // Generate token
    const token = generateToken(user._id);
    console.log(token)
    // Set token in cookie
    await sendOTP({ _id: user._id, email: user.email }, res);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

// Login function
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
      return res.status(400).json({ message: "User not found" });
  }
  
  // Check if user is verified
  if (!user.verify) {
      return res.status(400).json({ message: "Please verify your email before logging in" });
  }
  
  console.log(user);
  
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  
  if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
  }
  
  console.log(user._id);
  
  // Generate token
  const token = generateToken(user._id);
  console.log(token);
  
  // Set token in cookie
  res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  
  // Send success response
  return res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token,
      data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          type: user.user_type,
      }, 
  });
  
    return res.status(200).json({success: true, message: "User logged in successfully", data: { _id: user._id, name: user.name, email: user.email }});
});


    // 

  // Send OTP verification email
const sendOTP = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

      // Mail options
      let mailOptions = {
          from: "noreply@gmail.com",
          to: email,
          subject: "Please confirm your account",
          html: `Hello,<br> Please confirm your account by entering the following OTP: <b>${otp}</b>
                 <br>OTP is valid for 10 minutes only.<br>`,
      };

      // Hash the OTP
      const salt = await bcrypt.genSalt(5);
      const hashedOTP = await bcrypt.hash(otp, salt);

      const fOTP = new UserOTPVerification({
          user: _id,
          otp: hashedOTP,
          createdAt: new Date(Date.now()),
          expires_at: new Date(Date.now() + 10 * 60000)
      });

      await fOTP.save();

      // Send mail
      await Transport.sendMail(mailOptions);

      res.status(200).json({
          success: true,
          message: "OTP sent successfully",
          Data: {
              _id,
              email,
          },
      });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
};

  // verify email
  
  const verifyEmail = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body;
    console.log(userId, otp);
  
    // Find the OTP verification record for the user
    const userOTPVerificationRecord = await UserOTPVerification.findOne({
      user: userId,
    });
    const useremail = await User.findById(userId);
    
    if (!useremail) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const email = useremail.email;
    console.log(useremail);
  
    if (!userOTPVerificationRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    // Check if OTP is expired
    const { expires_at, otp: hashedOTP } = userOTPVerificationRecord;
    const isExpired = expires_at < Date.now();
  
    if (isExpired) {
      return res.status(400).json({ message: "OTP expired" });
    }
  
    // Compare OTP
    try {
      console.log(otp, hashedOTP);
      const isMatch = await bcrypt.compare(otp, hashedOTP);
  
      if (isMatch) {
        // OTP matched, update user as verified
        console.log("OTP matched, updating user as verified");
        
        // Update user verify status
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { verify: true },
          { new: true } // Ensure it returns the updated document
        );
        console.log(updatedUser.verify);
        if (!updatedUser) {
          return res.status(400).json({ message: "Failed to verify user" });
        }
  
        await UserOTPVerification.deleteMany({ user: userId });
        console.log("Email verified successfully");
  
        return res.status(200).json({
          success: true,
          message: "Email verified successfully",
          email: updatedUser.email,
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      console.error('Error comparing OTP:', error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  

  module.exports={

    login,
    signup,
    verifyEmail,
  }