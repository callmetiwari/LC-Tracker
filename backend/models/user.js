const { required } = require("joi");
const mongoose=require("mongoose");
const { type } = require("os");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type: String,
        required:true
    } 
});

userSchema.plugin(passportLocalMongoose);

const Users=mongoose.model("Users",userSchema);
module.exports=Users;
