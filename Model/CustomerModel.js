const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required : true
    },
    phonenumber:{
        type:Number,
        required:true
    }
    // Add more fields as needed (e.g., address, phone number, etc.)
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
