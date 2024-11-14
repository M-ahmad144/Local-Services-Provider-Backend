const express = require("express");
const {
  createCheckoutSession,
  confirmPaymentStatus,
  verifyPaymentSession,
} = require("../Controllers/stripeController");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm-payment", confirmPaymentStatus);
router.get("/verify-session/:sessionId", verifyPaymentSession);

module.exports = router;
