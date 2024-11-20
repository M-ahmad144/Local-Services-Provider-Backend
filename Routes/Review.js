
const express = require("express");
const { reviewdata } = require("../Controllers/Review");


const router = express.Router();

router.post("/reviewdata", reviewdata);






