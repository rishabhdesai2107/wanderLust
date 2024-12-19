const express = require("express");
const router = express.Router({mergeParams: true});//merger params is used so that the child routes can access the parameters(eg. id) in the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");



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

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new");
});

router.get("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","The listing you are trying to access doesn't exist");
    res.redirect("/listings");
    }
    res.render("listings/show",{listing});
}));

router.post("/",ValidateListing,isLoggedIn,wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
    }
))

router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

router.put("/:id",isLoggedIn,ValidateListing,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(!Listing){
        req.flash("error","The listing you are trying to access doesn't exist");
        res.redirect("/listings");
    }
    req.flash("success","Listing updated");
    res.redirect("/listings");
}));

router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));


module.exports = router;