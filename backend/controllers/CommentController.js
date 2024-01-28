const Comment = require("../models/comment");
const Product = require("../models/product");

const CommentController = {
    addComment: async (req, res) => {
        const { text, userId, productId, name } = req.body; 

        try {
            const product = await Product.findById(userId).exec();
            
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const newComment = new Comment({
                text,
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
        const commentId = req.params.CommentId;
        const { text } = req.body;

        try {
            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { text },
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
        const commentId = req.params.commentId;

        try {
            const result = await Comment.deleteOne({ _id: commentId });

            if (result.deletedCount === 0) {
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