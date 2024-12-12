const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); //used curly brackets as it is a named import.

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");
    res.render("listings/show.ejs", { listing });
});

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const { title, description, Image, price, country, location } = req.body;
    const editListing = {
        title: title,
        description: description,
        Image: Image,
        price: price,
        location: location,
        country: country,
    };
    await Listing.findByIdAndUpdate(id, editListing);
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
});

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    const { title, description, Image, price, country, location } = req.body;
    const newListing = {
        title: title,
        description: description,
        Image: Image,
        price: price,
        location: location,
        country: country,
    };

    const newList = new Listing(newListing);
    newList.owner = req.user._id;
    await newList.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

module.exports = router;
