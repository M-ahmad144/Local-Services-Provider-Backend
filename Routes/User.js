const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  roleSelection,
  logout,
  updatePassword,
<<<<<<< Updated upstream
  resendOTP,
  getUsers
=======
>>>>>>> Stashed changes
} = require("../Controllers/User");

const router = express.Router();

router.get("/get-all-users", getUsers)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/role-selection", roleSelection);
router.post("/OTP-verification", verifyEmail);
router.post("/change-password",updatePassword);
<<<<<<< Updated upstream
router.post("/resend-OTP",resendOTP);
=======
>>>>>>> Stashed changes

module.exports = router;
