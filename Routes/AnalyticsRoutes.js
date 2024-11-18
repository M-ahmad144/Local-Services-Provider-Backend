const express = require("express");

const {
  GetAllOrders,
  SuccessfulTransactions
} = require("../Controllers/Analytics");

const router = express.Router();


router.get("/orders", GetAllOrders);
router.get("/transactions", SuccessfulTransactions);




module.exports = router;
