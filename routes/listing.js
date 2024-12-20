const express = require("express");
const router = express.Router({mergeParams: true});//merger params is used so that the child routes can access the parameters(eg. id) in the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, ValidateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");




router.get("/", wrapAsync(listingController.index));

router.get("/new",isLoggedIn,listingController.rendernewForm);

router.get("/:id",wrapAsync(listingController.showListing));

router.post("/",ValidateListing,isLoggedIn,wrapAsync(listingController.createListing));

router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

router.put("/:id",isLoggedIn,isOwner,ValidateListing,wrapAsync(listingController.updateListing));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;