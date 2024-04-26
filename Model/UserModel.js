// const mongoose = require('mongoose');

// // Define User schema
// const userSchema = new mongoose.Schema
// ({
//   firstname: { type: String,required: true},
//   lastname:  { type: String,required: true},
//   username:  { type: String,required: true},
//   password:  { type: String,required: true}
// });

// // Create User model
// const User = mongoose.model('User', userSchema);

// module.exports = User;
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname : {type:String, required:true},
    lastname : {type:String,required:true},
    username:  { type: String,required: true},
    password:  { type: String,required: true}
    // email : {type:String,required:true}
},{timestamps:true});
module.exports = mongoose.model('User',userSchema); 