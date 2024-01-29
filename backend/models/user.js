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
    
    boughtProducts: [
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoughtProduct" 
        }
    ],

    soldProducts: [
        { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "SoldProduct" 
        }
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;