// Import Mongoose
const mongoose = require('mongoose');

// Define the schema for AddCart
const addCartSchema = new mongoose.Schema({
  menuname: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

// Create the AddCart model
const AddCart = mongoose.model('AddCart', addCartSchema);

// Export the model
module.exports = AddCart;
