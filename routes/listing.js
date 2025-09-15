const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const listingController = require("../controllers/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js"); // Combined imports
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new", isLoggedIn, listingController.renderNewForm); // New route for rendering form

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner, // Added isOwner middleware
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner, // Added isOwner middleware
        wrapAsync(listingController.destroyListing) // Used destroyListing
    );

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)); // Edit route

module.exports = router;