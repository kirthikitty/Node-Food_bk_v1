const mongoose = require('mongoose');
const Address = new mongoose.Schema({
    doorno : Number,
    street : String,
    city : String,
    state : String,
    pincode : Number,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

    
},{timestamps:true});
module.exports = mongoose.model('Address',Address); 