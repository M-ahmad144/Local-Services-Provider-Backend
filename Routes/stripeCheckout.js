const express = require("express");

const router = express.Router();
const { confirmPaymentStatus } = require("../Controllers/stripeController");

// router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm-payment", confirmPaymentStatus);

module.exports = router;
