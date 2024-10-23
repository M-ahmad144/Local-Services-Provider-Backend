// paymentRouter.js

const express = require("express");
const { checkout } = require("../Controllers/jazzcashController");

const router = express.Router();

// Define the checkout route
router.post("/checkout/:productId", checkout);

module.exports = router;
