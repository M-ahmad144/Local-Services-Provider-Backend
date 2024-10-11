const express = require("express");
const { UpdateProfile, GetProfileById } = require("../Controllers/Profile");

const router = express.Router();

router.patch("/edit-profile/:user_id", UpdateProfile);
router.get("/user/:user_id", GetProfileById);

module.exports = router;
