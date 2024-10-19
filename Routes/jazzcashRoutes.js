const express = require("express");
const { initiatePayment } = require("../Controllers/jazzcashController");
const router = express.Router();

router.post("/initiate-payment", initiatePayment);

module.exports = router;
