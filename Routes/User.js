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
  CreateUser

} = require("../Controllers/User");

const router = express.Router();

router.get("/get-all-users", getUsers)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/role-selection", roleSelection);
router.post("/OTP-verification", verifyEmail);
router.post("/change-password",updatePassword);
router.post("/resend-OTP",resendOTP);

router.post('/admin/create' , CreateUser)


module.exports = router;
