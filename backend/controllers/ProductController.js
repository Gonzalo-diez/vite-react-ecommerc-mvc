const Product = require("../models/product");
const Comment = require("../models/comment");
const User = require("../models/user");

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
            const Product = await Product.findOne({ _id: productId }).exec();

            if (!Product) {
                return res.status(404).json({ error: "Product no encontrado" });
            }

            return res.json(Product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getCommentsByProduct: async (req, res, next) => {
        const ProductId = req.params.id;

        try {
            const comments = await Comment.find({ Product: ProductId }).populate('usuario').exec();

            if (!comments) {
                return res.status(404).json({ error: 'comments no encontrados' });
            }

            return res.json(comments);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    addProduct: async (req, res, next) => {
        const { title, brand, description, price, stock, category } = req.body;
        const userId = req.user._id;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const newProduct = new Product({
                user: userId,
                title,
                brand,
                description,
                price,
                stock,
                category,
                image: imageName,
            });

            await newProduct.save();

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { createdProducts: newProduct._id } },
                { new: true }
            ).populate('createdProducts');

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
                user: updatedUser,
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

            req.io.emmit("deleteProduct", {message: "Producto borrado", productId: productId})

            return res.json("Producto eliminado!");
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
};

module.exports = ProductController;