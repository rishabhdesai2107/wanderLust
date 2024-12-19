const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }
})
//passport adds the username and password into our user schema implicitly.

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);