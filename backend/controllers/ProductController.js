const mongoose = require("mongoose");
const Comment = require("../models/comment")
const Product = require("../models/product");
const User = require("../models/user");
const { io } = require("../index");

const ProductController = {
    getAllproduct: async (req, res, next) => {
        try {
            const product = await Product.find({}).populate({
                path: 'user',
                model: 'User',
            });
            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getproductByCategory: async (req, res, next) => {
        const category = req.params.category;

        try {
            const product = await Product.find({ category }).exec();
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
    
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
    
            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },    


    getCommentsByProduct: async (req, res, next) => {
        const productId = req.params.id;
    
        try {
            const comments = await Comment.find({ product: productId }).exec();
            return res.json(comments);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },    
    

    addProduct: async (req, res, next) => {
        const { title, brand, description, price, stock, category, userId } = req.body;
    
        try {
            const user = await User.findById(userId).exec();
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const images = req.files.map(file => file.filename);

            if (!images || images.length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron imágenes válidas' });
            }
    
            const newProduct = new Product({
                title,
                brand,
                description,
                price,
                stock,
                category,
                images,
                user: userId,
            });
    
            const savedProduct = await newProduct.save();
    
            user.createdProducts.push(savedProduct);
            await user.save();
    
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
        const { title, brand, description, price, stock, category, userId } = req.body;

        try {
            const user = await User.findById(userId).exec();
            
            if (!user) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const product = await Product.findById(productId).exec();

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            if (product.user.toString() !== userId) {
                return res.status(403).json({ error: "No tienes permisos para editar este producto" });
            }

            const images = req.files.map(file => file.filename);

            if (!images || images.length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron imágenes válidas' });
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
                    images,
                    user: userId,
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
            const deleteProduct = await Product.deleteOne({ _id: productId });

            if (deleteProduct.deletedCount === 0) {
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
