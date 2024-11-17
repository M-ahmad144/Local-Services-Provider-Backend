const express = require("express");

const {
  GetAllOrders
} = require("../Controllers/Analytics");

const router = express.Router();


router.get("/orders", GetAllOrders);



module.exports = router;
