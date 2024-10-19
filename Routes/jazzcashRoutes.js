const express = require("express");
const router = express.Router();
const jazzcashController = require("../Controllers/jazzcashController");

router.post("/initiate-payment", jazzcashController.initiatePayment);

module.exports = router;
