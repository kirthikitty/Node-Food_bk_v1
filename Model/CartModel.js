const mongoose =require('mongoose')

const cartSchema =new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menuitems: [
    {
      menuitem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, default: 1 },
    }
  ],
  totalPrice: { type: Number, default: 0.0 },
},{ timestamps: true });
module.exports = mongoose.model('Cart', cartSchema);