const express = require("express");
const router = express.Router();

const UserRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const CommentRoutes = require("./routes/commentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const questionRoutes = require("./routes/questionRoutes");

router.use("/usuarios", UserRoutes);
router.use("/productos", ProductRoutes);
router.use("/preguntas", questionRoutes);
router.use("/comentarios", CommentRoutes);
router.use("/carrito", cartRoutes);

module.exports = router;