const mongoose = require("mongoose");

const boughtProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  price: { type: Number },
}, { timestamps: true });

const BoughtProduct = mongoose.model("BoughtProduct", boughtProductSchema);

module.exports = BoughtProduct;