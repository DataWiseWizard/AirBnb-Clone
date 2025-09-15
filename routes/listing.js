const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const listingController = require("../controllers/listings.js");
const { isLoggedIn, validateListing } =  require("../middlewares.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new",   listingController.renderNewForm);

router
.route("/")
.get(wrapAsync(listingController.index))
.post( upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( upload.single("listing[image]"), validateListing,  wrapAsync(listingController.updateListing))
.delete(wrapAsync(listingController.destroyListing));

//New route  


//Edit Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync(listingController.destroyListing));

//New route  


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));


module.exports = router;