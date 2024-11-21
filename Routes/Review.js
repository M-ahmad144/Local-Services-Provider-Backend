
<<<<<<< Updated upstream
const express = require("express");
const { reviewdata } = require("../Controllers/Review");

=======
// const express = require("express");
// //const { createReview, getReviewByID, getReviewsByServiceID } = require("../Controllers/Review");
>>>>>>> Stashed changes

// const router = express.Router();

router.post("/reviewdata", reviewdata);


module.exports = router;



