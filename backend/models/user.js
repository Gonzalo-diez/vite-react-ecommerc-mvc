const mongoose = require("mongoose");

// Define el modelo de usuario en Mongoose
const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    avatar: String,
    createdProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;