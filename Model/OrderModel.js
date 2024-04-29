const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Delivered'],
        default: 'Pending'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
