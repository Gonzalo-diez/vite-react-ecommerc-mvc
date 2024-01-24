const express = require("express");
const router = express.Router();

const UserRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const CommentRoutes = require("./routes/commentRoutes");
const ShopRoutes = require("./routes/shopRoutes");

router.use("/users", UserRoutes);
router.use("/products", ProductRoutes);
router.use("/comments", CommentRoutes);
router.use("/shop", ShopRoutes);

module.exports = router;