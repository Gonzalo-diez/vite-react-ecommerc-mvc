const express = require("express");
const multer = require("multer");
const ProductController = require("../controllers/ProductController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const productRoutes = express.Router();
productRoutes.use("/protected", protectWithJWT);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage: storage });

productRoutes.get("/", ProductController.getAllproduct);
productRoutes.get("/:category", ProductController.getproductByCategory);
productRoutes.get("/detalle/:id", ProductController.getProductDetail);
productRoutes.get("/preguntas/:id", ProductController.getQuestionsByProduct);
productRoutes.get("/comentarios/:id", ProductController.getCommentsByProduct);
productRoutes.post("/protected/agregarProducto", protectWithJWT, upload.array("images"), ProductController.addProduct);
productRoutes.put("/protected/editarProducto/:id", protectWithJWT, upload.array("images"), ProductController.updateProduct);
productRoutes.delete("/protected/borrarProducto/:id", protectWithJWT, ProductController.deleteProduct);

module.exports = productRoutes;