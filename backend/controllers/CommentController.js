const mongoose = require("mongoose")
const Comment = require("../models/comment");
const Product = require("../models/product");
const User = require("../models/user");
const BoughtProduct = require("../models/boughtProduct");

const CommentController = {
    getRatings: async (req, res, next) => {
        const { rating } = req.body;

        try {
            const ratings = await Comment.find(rating);
            return res.json(ratings);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getCommentById: async (req, res) => {
        const commentId = req.params.id;

        try {
            const commentObjectId = new mongoose.Types.ObjectId(commentId);
            const comment = await Comment.findById(commentObjectId).select("text rating").exec();
            if (!comment) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.json(comment);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addComment: async (req, res) => {
        const { text, rating, userId, productId, name } = req.body;
    
        try {
            const boughtProduct = await BoughtProduct.findOne({
                user: userId,
                product: productId,
                completed: true
            }).exec();
    
            if (!boughtProduct) {
                return res.status(403).json({
                    error: 'No puedes comentar un producto que no has comprado o no ha sido completado',
                    boughtProduct: boughtProduct
                });
            }

            const product = await Product.findById(productId).exec();
    
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const newComment = new Comment({
                text,
                rating,
                user: userId,
                product: productId,
                name,
            });
    
            await newComment.save();
    
            return res.json('Comentario agregado');
        } catch (err) {
            console.error('Error al guardar el comentario:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },    

    editComment: async (req, res) => {
        const commentId = req.params.id;
        const { text, rating, userId } = req.body;

        try {
            const user = await User.findById(userId).exec();
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const comment = await Comment.findById(commentId).exec();

            if (!comment) {
                return res.status(404).json({ error: "Comentario no encontrado" });
            }

            if (comment.user.toString() !== userId) {
                return res.status(403).json({ error: "No tienes permisos para editar este producto" });
            }

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { text, rating, user: userId },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }

            return res.json('Comentario actualizado');
        } catch (err) {
            console.error('Error en la actualización del comentario:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    deleteComment: async (req, res) => {
        const commentId = req.params.id;

        try {
            const deleteComment = await Comment.deleteOne({ _id: commentId });

            if (deleteComment.deletedCount === 0) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }

            return res.json('Comentario eliminado');
        } catch (err) {
            console.error('Error al eliminar el comentario:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },
};

module.exports = CommentController;