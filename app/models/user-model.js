const mongoose = require('mongoose')
const {Schema,model} = mongoose

// User - Schema
const userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    role:String,
    profilePicture: String,
    bio:String
},{timestamps:true})

// User model

const User = model('User',userSchema)
module.exports = User