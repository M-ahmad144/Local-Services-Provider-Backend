const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  roleSelection,
  logout,
  updatePassword,
  resendOTP,
  getUsers,
  CreateUser,
  deleteUserByAdmin,
} = require("../Controllers/User");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/role-selection", roleSelection);
router.post("/OTP-verification", verifyEmail);
router.post("/change-password", updatePassword);
router.post("/resend-OTP", resendOTP);

// Admin Routes
router.get("/get-all-users", getUsers);
router.post("/admin/create", CreateUser);
router.delete("/admin/delete/:id", deleteUserByAdmin);

module.exports = router;
