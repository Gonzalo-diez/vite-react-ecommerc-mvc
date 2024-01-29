const mongoose = require("mongoose");

const soldProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number },
  status: { type: String, default: "activo" },
}, { timestamps: true });

const SoldProduct = mongoose.model("SoldProduct", soldProductSchema);

module.exports = SoldProduct;