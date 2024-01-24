const mongoose = require("mongoose");
const Product = require("../models/product");
const Comment = require("../models/comment");

const ProductController = {
    getAllproduct: async (req, res, next) => {
        try {
            const product = await Product.find({});
            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getproductByCategory: async (req, res, next) => {
        const categoria = req.params.categoria;

        try {
            const product = await Product.find({ categoria }).exec();
            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductDetail: async (req, res, next) => {
        const id = req.params.id;

        try {
            const productId = new mongoose.Types.ObjectId(id);
            const product = await Product.findOne({ _id: productId }).exec();

            if (!Product) {
                return res.status(404).json({ error: "Product no encontrado" });
            }

            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addProduct: async (req, res, next) => {
        const { title, brand, description, price, stock, category } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const newProduct = new Product({
                title,
                brand,
                description,
                price,
                stock,
                category,
                image: imageName,
            });

            await newProduct.save();

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });

        } catch (err) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    updateProduct: async (req, res, next) => {
        const productId = req.params.id;
        const { title, brand, description, price, stock, category } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    title,
                    brand,
                    description,
                    price,
                    stock,
                    category,
                    image: imageName,
                },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json("Producto actualizado!");
        } catch (err) {
            console.error("Error en la actualización:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    deleteProduct: async (req, res, next) => {
        const productId = req.params.id;

        try {
            const result = await Product.deleteOne({ _id: productId });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json("Producto eliminado!");
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
};

module.exports = ProductController;