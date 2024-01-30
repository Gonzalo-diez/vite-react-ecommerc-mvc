const mongoose = require("mongoose");

// Define el modelo de productos comprados en Mongoose
const boughtProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const BoughtProduct = mongoose.model("BoughtProduct", boughtProductSchema);

module.exports = BoughtProduct;