const mongoose = require("mongoose");

// Define el modelo de productos vendidos en Mongoose
const soldProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Usuario que compró el producto
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Usuario que creó el producto
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: { type: String },
  quantity: { type: Number, min: 1 },
  price: { type: Number },
  status: { type: String, default: "activo" },
}, { timestamps: true });

const SoldProduct = mongoose.model("SoldProduct", soldProductSchema);

module.exports = SoldProduct;