const express = require("express");
const router = express.Router();

const UserRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const CommentRoutes = require("./routes/commentRoutes");
const ShopRoutes = require("./routes/shopRoutes");

router.use("/usuarios", UserRoutes);
router.use("/productos", ProductRoutes);
router.use("/comentarios", CommentRoutes);
router.use("/compras", ShopRoutes);

module.exports = router;