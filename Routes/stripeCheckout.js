const express = require("express");

const router = express.Router();
const { createCheckoutSession } = require("../Controllers/stripeController");

router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm-payment", createCheckoutSession);

module.exports = router;
