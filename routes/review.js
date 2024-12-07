const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const {validateReview,
} = require("../middlewares.js");

const reviewController = require("../controllers/reviews.js");

// Reviews
// POST Route
router.post("/", validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(reviewController.destroyReview));

module.exports= router;
