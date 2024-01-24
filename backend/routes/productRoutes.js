const express = require("express");
const multer = require("multer");
const path = require("path");
const ProductController = require("../controllers/ProductController");
const passport = require("passport");

const productRoutes = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

productRoutes.get("/", ProductController.getAllproduct);
productRoutes.get("/categoria/:category", ProductController.getproductByCategory);
productRoutes.get("/detalle/:id", ProductController.getProductDetail);
productRoutes.post("/protected/agregar", passport.authenticate('jwt', { session: false }), upload.single("image"), ProductController.addProduct);
productRoutes.put("/protected/editar/:id", passport.authenticate('jwt', { session: false }), upload.single("image"), ProductController.updateProduct);
productRoutes.delete("/protected/borrar/:id", passport.authenticate('jwt', { session: false }), ProductController.deleteProduct);

module.exports = productRoutes;