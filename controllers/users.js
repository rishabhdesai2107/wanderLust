const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");
};

module.exports.signup = async(req,res,next)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password );
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User was entered successfully");
        res.redirect("/listings");
    });//direct login after signup
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }

};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login");
};

module.exports.login = async(req,res)=>{
    req.flash("success","welcome to wanderlust you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl)

;}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
};

