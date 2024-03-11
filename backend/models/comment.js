const mongoose = require("mongoose");

// Define el modelo de comentario en Mongoose
const commentSchema = new mongoose.Schema({
    text: String,
    rating: { 
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    name: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;