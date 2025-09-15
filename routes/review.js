const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js"); // Combined imports
const reviewController = require("../controllers/reviews.js");

// Reviews
// POST Route
router.post("/",
    isLoggedIn, // Added isLoggedIn middleware
    validateReview,
    wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete("/:reviewId",
    isLoggedIn, // Added isLoggedIn middleware
    isReviewAuthor, // Added isReviewAuthor middleware
    wrapAsync(reviewController.destroyReview) // Used destroyReview
);

module.exports = router;