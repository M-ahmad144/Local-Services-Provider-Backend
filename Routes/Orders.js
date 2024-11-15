const express = require("express");
const {
  CreateOrder,
  GetPendingOrders,
  counterPriceUpdate,
  counterTimeUpdate,
  orderAcceptUpdate,
  GetInProgressOrders,
  orderRejectUpdate,
  markAsCompletedByFreelancer,
  confirmOrderCompletion,
    GetDisputedOrders,
} = require("../Controllers/OrdersController");

const router = express.Router();

router.post("/create", CreateOrder);
router.get("/pending", GetPendingOrders);
router.get("/in_progress", GetInProgressOrders);

router.patch("/counter_price_update", counterPriceUpdate);

router.patch("/time_update", counterTimeUpdate);

router.get('/pending' , GetPendingOrders)
router.get('/in_progress' , GetInProgressOrders)
router.get('/disputed' , GetDisputedOrders)


router.patch("/reject", orderRejectUpdate);

router.patch("/complete_by_freelancer", markAsCompletedByFreelancer);

router.patch("/confirm_completion", confirmOrderCompletion);

module.exports = router;
