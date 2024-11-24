

const express = require("express");
const { reviewdata ,addreview, getReviewsByServices} = require("../Controllers/Review");

const router=express.Router();

router.post("/reviewdata", reviewdata);


router.get("/review-by-service", getReviewsByServices);

router.post("/addreview", addreview);


module.exports = router;



