const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname : {type:String, required:true},
    lastname : {type:String,required:true},
    username:  { type: String,required: true},
    password:  { type: String,required: true},
    address:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);