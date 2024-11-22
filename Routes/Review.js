

const express = require("express");
const { reviewdata ,addreview} = require("../Controllers/Review");

const router=express.Router();

router.post("/reviewdata", reviewdata);
router.post("/addreview", addreview);


module.exports = router;



