const express = require("express");
const router = express.Router({mergeParams: true});//merger params is used so that the child routes can access the parameters(eg. id) in the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, ValidateListing} = require("../middleware.js");




router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new");
});

router.get("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{
        path: "author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","The listing you are trying to access doesn't exist");
    res.redirect("/listings");
    }
    res.render("listings/show",{listing});
}));

router.post("/",ValidateListing,isLoggedIn,wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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

router.put("/:id",isLoggedIn,isOwner,ValidateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));


module.exports = router;