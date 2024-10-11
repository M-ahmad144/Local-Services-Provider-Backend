const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  roleSelection,
  logout,
} = require("../Controllers/User");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/role-selection", roleSelection);
router.post("/OTP-verification", verifyEmail);

module.exports = router;
