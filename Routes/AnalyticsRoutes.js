const express = require("express");

const {
  GetAllOrders,
  SuccessfulTransactions,
  GetOrdersCountByService
} = require("../Controllers/Analytics");

const router = express.Router();


router.get("/orders", GetAllOrders);
router.get("/transactions", SuccessfulTransactions);
router.get("/orders-count", GetOrdersCountByService);





module.exports = router;
