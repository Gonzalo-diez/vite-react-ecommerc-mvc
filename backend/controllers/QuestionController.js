const mongoose = require("mongoose");
const Question = require("../models/question");
const Product = require("../models/product");
const User = require("../models/user");

const QuestionController = {
    getQuestionById: async (req, res) => {
        const questionId = req.params.id;

        try {
            const questionObjectId = new mongoose.Types.ObjectId(questionId);
            const question = await Question.findById(questionObjectId).select("text name").exec();
            if (!question) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.json(question);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addQuestion: async (req, res) => {
        const { text, userId, productId, name } = req.body;

        try {
            const product = await Product.findById(productId).exec();

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const newQuestion = new Question({
                text,
                user: userId,
                product: productId,
                name,
            });

            await newQuestion.save();

            return res.json('Pregunta agregada');
        } catch (err) {
            console.error('Error al guardar la pregunta:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    editQuestion: async (req, res) => {
        const questionId = req.params.id;
        const { text, userId } = req.body;

        try {
            const user = await User.findById(userId).exec();

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const question = await Question.findById(questionId).exec();

            if (!question) {
                return res.status(404).json({ error: "Pregunta no encontrada" });
            }

            if (question.user.toString() !== userId) {
                return res.status(403).json({ error: "No tienes permisos para editar esta pregunta" });
            }

            const updatedQuestion = await Question.findByIdAndUpdate(
                questionId,
                { text, user: userId },
                { new: true }
            );

            if (!updatedQuestion) {
                return res.status(404).json({ error: 'Pregunta no encontrada' });
            }

            return res.json('Pregunta actualizada');
        } catch (err) {
            console.error('Error en la actualización de la pregunta:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    deleteQuestion: async (req, res) => {
        const questionId = req.params.id;

        try {
            const deleteQuestion = await Question.deleteOne({ _id: questionId });

            if (deleteQuestion.deletedCount === 0) {
                return res.status(404).json({ error: 'Pregunta no encontrada' });
            }

            return res.json('Pregunta eliminada');
        } catch (err) {
            console.error('Error al eliminar la pregunta:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    respondQuestion: async (req, res) => {
        const questionId = req.params.id;
        const { text, userId } = req.body;

        try {
            const user = await User.findById(userId).exec();
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const question = await Question.findById(questionId).exec();
            if (!question) {
                return res.status(404).json({ error: 'Pregunta no encontrada' });
            }

            const product = await Product.findById(question.product).exec();
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            if (product.user.toString() !== userId) {
                return res.status(403).json({ error: 'No tienes permisos para responder a esta pregunta' });
            }

            question.responses.push({
                text,
                userId,
                productId: product._id,
                date: new Date(),
            });

            await question.save();

            return res.json('Respuesta agregada a la pregunta');
        } catch (err) {
            console.error('Error al responder a la pregunta:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    }
}

module.exports = QuestionController;