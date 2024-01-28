const mongoose = require("mongoose");

// Define el modelo de compra en Mongoose
const shopSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
    fecha: {
        type: Date,
        default: Date.now,
    },
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;