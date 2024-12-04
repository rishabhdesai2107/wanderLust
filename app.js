const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/",(req,res)=>{
    res.send("Hi there Rishabh here");
});
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
    });

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
});

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const {title,description,image,price,country,location} = req.body;
    const editListing = {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    }
    await Listing.findByIdAndUpdate(id,editListing);
    res.redirect("/listings");
});


app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.post("/listings",async(req,res)=>{
    const {title,description,image,price,country,location} = req.body;
    const newListing = {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    }

    const newList = new Listing(newListing);
    await newList.save();
    res.redirect("/listings");
})

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

