const mongoose = require("mongoose");

// Define el modelo de preguntas en mongoose
const questionSchema = new mongoose.Schema({
    text: String,
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
    responses: [{
        text: String,
        name: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;