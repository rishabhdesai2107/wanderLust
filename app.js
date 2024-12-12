const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
});

app.listen(port, ()=>{
    console.log("server is running....");
});

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions = {
    secret: "mysupersecretcode", //helps create a unique, tamper-proof session ID that is sent to the user as a cookie.
    resave: false, //If a user visits the site but doesn’t do anything to change their session data, it won't save it repeatedly.
    saveUninitialized: true, //This means the server will create and save a session even if it has no data yet.
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions)); //adds the session management functionality to your app.

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//req.user is a property that typically holds the details of the currently authenticated user. This is commonly used when authentication middleware, such as Passport.js, is integrated into the application.
    next();
}) //By adding these to res.locals, they are directly accessible in the templates without needing to pass them manually for every view.

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "rishabh"
// });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.get("/",(req,res)=>{
    res.send("Hi there Rishabh here");
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  res.status(statusCode).render("errors.ejs", { message });
  // res.status(statusCode).send(message);
});

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         image: "./image1.jpg",
//         price: 12000,
//         location: "panjim,goa",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("data sucessfully added");
// });

