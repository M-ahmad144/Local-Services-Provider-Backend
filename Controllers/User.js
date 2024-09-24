const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Models/User");
const sendEmail = require("../Utils/sendEmail");
const dotenv = require('dotenv');
dotenv.config();

let Transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAILER,
        pass: process.env.password,
    },
  });


  // send otp verification email
const sendOTP = async ({ _id, email }, res) => {
    try {
      // console.log("send otp 1 ");
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  
      // mail options
      let mailOptions = {
        from: "rrcode6681@gmail.com",
        to: email,
        subject: "Please confirm your account",
        html: `Hello,<br> Please confirm your account by entering the following OTP: <b>${otp}</b>
      <br>OTP is valid for 10 minutes only.<br>`,
      };
      // console.log("send otp 2 ");
  
  // console.log(otp)
      //hash the otp
      const salt = await bcrypt.genSalt(5);
  // console.log(otp,salt)
  
  const UserId= await User.findById(_id);
  // console.log(UserId);
  
      const hashedOTP = await bcrypt.hash(otp, salt);
    
   const   fOTP = new UserOTPVerification({
        user: UserId._id,
        otp: hashedOTP,
        createdAt: new Date(Date.now()),
        expires_at: new Date(Date.now() + 10 * 60000)
      });
      console.log(fOTP);  
      // console.log(fOTP);
      await fOTP.save();
      // console.log("send otp 3 ");
  
      //send mail
      await Transport.sendMail(mailOptions);
      
  
      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        Data: {
          _id: _id,
          email: email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  // verify email
  
  const verifyEmail = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body;
    // console.log(userId, otp);
  
    // Find the OTP verification record for the user
    const userOTPVerificationRecord = await UserOTPVerification.findOne({
      user: userId,
    });
    const useremail= await User.findById(userId);
    // console.log(useremail);
    const email=useremail.email;
  
    // console.log(userOTPVerificationRecord);
  
    if (!userOTPVerificationRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    // Check if OTP is expired
    const { expires_at, otp: hashedOTP } = userOTPVerificationRecord;
    const isExpired = expires_at < Date.now();
    // console.log(isExpired);
  
    if (isExpired) {
      return res.status(400).json({ message: "OTP expired" });
    }
  
    // Compare OTP
    try {
      console.log(otp, hashedOTP);
      const isMatch = await bcrypt.compare(otp, hashedOTP);
  
      if (isMatch) {
        // OTP matched, update user as verified
        console.log("OTP matched, update user as verified");
        // await User.findByIdAndUpdate(userId, { isVerified: true });
        useremail.isVerified=true;
        await UserOTPVerification.deleteMany({ user: userId });
        console.log("Email verified successfully");
        return res.status(200).json({ success: true, message: "Email verified successfully" ,email:email });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      console.error('Error comparing OTP:', error);
      return res.status(500).json({ message: "Server error" });
    }
  });