const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Models/User");
const UserOTPVerification = require("../Models/UserOTPVerification");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
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
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Login function
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.is_google) {
    return res.status(400).json({
      message: "you have signed up with google please login with google",
    });
  }

  // Check if user is verified
  if (!user.verify) {
    return res
      .status(400)
      .json({ message: "Please verify your email before logging in" });
  }

  console.log(user);

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  console.log(user._id);

  // Generate token
  const token = generateToken(user._id);
  console.log(token);

  // Set token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
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
      user_type: user.user_type,
      profile_img: user.profile_image,
    },
  });

  // return res.status(200).json({success: true, message: "User logged in successfully", data: { _id: user._id, name: user.name, email: user.email }});

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.user_type,
      image: user.profile_image,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0), // Expire the cookie immediately
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const roleSelection = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  console.log(email, role);
  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  user.user_type = role;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Role selected successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      user_type: user.user_type,
    },
  });
});

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
    console.error("Error comparing OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Sign up function
const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName, email);

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
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
  console.log(token);

  // Send OTP but don't send a response in sendOTP
  await sendOTP({ _id: user._id, email: user.email });
  console.log("OTP sent successfully");
  // Set token in cookie and send response
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully and OTP sent.",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,

      user_type: "buyer",
    },
  });
});

// sendOTP function without response handling
const sendOTP = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Mail options
    let mailOptions = {
      from: "",
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
      expires_at: new Date(Date.now() + 10 * 60000), // OTP valid for 10 minutes
    });

    await fOTP.save();

    // Send mail
    await Transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Server error");
  }
};

const resendOTP = async (req, res) => {
  const { _id, email } = req.body;
  console.log("email", email);
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Mail options
    let mailOptions = {
      from: "", // Add the sender's email address
      to: email,
      subject: "Resend OTP - Please confirm your account",
      html: `Hello,<br> Here is your new OTP for account confirmation: <b>${otp}</b>
             <br>OTP is valid for 10 minutes only.<br>`,
    };

    // Hash the new OTP
    const salt = await bcrypt.genSalt(5);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Check if an OTP already exists for the user
    const existingOTP = await UserOTPVerification.findOne({ user: _id });
    if (existingOTP) {
      // Remove the existing OTP record
      await UserOTPVerification.deleteOne({ user: _id });
    }

    // Save the new OTP
    const newOTP = new UserOTPVerification({
      user: _id,
      otp: hashedOTP,
      createdAt: new Date(Date.now()),
      expires_at: new Date(Date.now() + 10 * 60000), // OTP valid for 10 minutes
    });

    await newOTP.save();

    // Send the new OTP via email
    await Transport.sendMail(mailOptions);

    console.log("OTP resent successfully.");
    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw new Error("Server error");
  }
};

const updatePassword = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  console.log(email, currentPassword, newPassword);

  // Check if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(200).json({ success: false, message: "User not found" });
  }
  console.log("User found");

  // Check if current password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res
      .status(200)
      .json({ success: false, message: "Incorrect password" });
  }
  console.log("Password matched");

  // Ensure the new password is different from the current password
  if (currentPassword === newPassword) {
    return res.status(200).json({
      success: false,
      message: "New password must be different from the current password",
    });
  }
  console.log("New password is different from the current password");

  // Encrypt new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  console.log("Password hashed successfully");
  // Update password
  user.password = hashedPassword;
  await user.save();
  console.log("Password updated successfully");
  res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});

const getUsers = async (req, res) => {
  try {
    // Fetch users with selected fields only
    const users = await User.find(
      {},
      "name email user_type verify profile_description profile_image location skills created_at"
    );

    // Send response
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users for admin dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users. Please try again later.",
    });
  }
};

const CreateUser = async (req, res, next) => {
  const { fullName, email, password, user_type } = req.body;

  if (!fullName || !email || !password || !user_type) {
    return res
      .status(400)
      .json({ message: "Missing required fields", success: false });
  }

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  user = new User({
    name: fullName,
    email: email,
    password: hashedPassword,
    user_type: user_type,
    verify: true,
  });

  await user.save();
  res
    .status(201)
    .json({ message: "User created successfully", success: true, user: user });
};

const deleteUserByAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  login,
  signup,
  logout,
  verifyEmail,
  roleSelection,
  updatePassword,
  CreateUser,
  resendOTP,
  getUsers,
  deleteUserByAdmin,
};
