const express = require("express");
const router = express.Router({mergeParams: true});//merger params is used so that the child routes can access the parameters(eg. id) in the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, ValidateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); //for parsing the multipart/form-data for uploading in the form and sending files to the server.
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}) //files will be saved in this storage of cloudinary



router.route("/") //router.route is used when several http methods in API have same route.
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),ValidateListing,wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.rendernewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),ValidateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));




module.exports = router;