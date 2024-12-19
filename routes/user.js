const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    await User.register(newUser,password );
    req.flash("success","User was entered successfully");
    res.redirect("/listings");
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
}));



module.exports = router;