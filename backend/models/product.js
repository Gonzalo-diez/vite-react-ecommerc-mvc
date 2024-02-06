const mongoose = require("mongoose");

// Define el modelo de producto en Mongoose
const productSchema = new mongoose.Schema({
    title: String,
    brand: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    images: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    carts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;