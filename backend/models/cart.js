const mongoose = require("mongoose");

// Define el modelo de compra en Mongoose
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    stock: Number,
    total: Number,
    country: String,
    state: String,
    city: String,
    street: String,
    phone: Number,
    cardBank: Number,
    securityNumber: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
