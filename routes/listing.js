const express = require("express");
const router = express.Router({mergeParams: true});//merger params is used so that the child routes can access the parameters(eg. id) in the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



//schema validation using joi
const ValidateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Schema validation
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

router.get("/new",(req,res)=>{
    res.render("listings/new");
});

router.get("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing});
}));

router.post("/",ValidateListing,wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        throw ExpressError(400,"send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    }
))

router.get("/:id/edit",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

router.put("/:id",ValidateListing,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;