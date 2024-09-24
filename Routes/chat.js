const express = require("express");
const router = express.Router();

router.post("/", createChat);

module.exports = router;
