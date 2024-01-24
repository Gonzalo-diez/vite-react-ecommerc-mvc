const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const config = require("../config/config");
const passport = require("passport");
const User = require("../models/user");
const Product = require("../models/product");
const Shop = require("../models/shop");

const UserController = {
    register: async (req, res, next) => {
        const { name, surname, email, password } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const newUser = new User({
                name,
                surname,
                email,
                password,
                avatar: imageName,
            });

            await newUser.save();

            const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, { expiresIn: '1h' });

            return res.json({
                message: "Usuario registrado!",
                usuario: {
                    _id: newUser._id,
                    name: newUser.name,
                    surname: newUser.surname,
                    email: newUser.email,
                    avatar: newUser.avatar,
                },
                token: token,
            });
        } catch (err) {
            return next(err);
        }
    },

    login: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

            return res.json({
                message: "Inicio de sesión exitoso",
                user: { _id: user._id, name: user.name, surname: user.surname, email: user.email },
                token: token,
            });
        })(req, res, next);
    },

    getUserCreatedProducts: async (req, res) => {
        const userId = req.params.userId;

        try {
            const productsCreated = await Product.find({ user: userId }).populate('user').exec();
            return res.json(productsCreated);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getUserBoughtProducts: async (req, res) => {
        const userId = req.params.userId;

        try {
            const shops = await Shop.find({ user: userId }).populate('Products.Product').exec();
            const BoughtProducts = shops.flatMap(Shop => Shop.Products.map(item => item.Product));

            return res.json(BoughtProducts);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getUserSoldProducts: async (req, res) => {
        const userId = req.params.userId;

        try {
            const SoldProducts = await Product.find({ user: userId }).exec();
            return res.json(SoldProducts);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getUserInfo: async (req, res) => {
        const userId = req.params.userId;

        try {
            const createdProducts = await Product.find({ usuario: userId }).exec();

            const shops = await Shop.find({ USER: userId }).populate('Products.Product').exec();
            const BoughtProducts = [];

            shops.forEach(Shop => {
                Shop.Products.forEach(Product => {
                    BoughtProducts.push(Product.Product);
                });
            });

            const SoldProducts = await Product.find({ 'shops.usuario': userId }).exec();

            return res.json({
                createdProducts,
                BoughtProducts,
                SoldProducts
            });
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getUserDetail: async (req, res) => {
        const id = req.params.id;

        try {
            const userId = new mongoose.Types.ObjectId(id);

            const user = await User.findOne({ _id: userId })
                .select("name surname email")
                .exec();

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.json(user);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    editUserProfile: async (req, res) => {
        const userId = req.params.userId;
        const { name, surname, email } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, surname, email, avatar: imageName },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.json("Perfil de usuario actualizado!");
        } catch (err) {
            console.error("Error en la actualización del perfil:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    changeUserPassword: async (req, res) => {
        const userId = req.params.userId;
        const { password } = req.body;

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { password },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.json("Contraseña de usuario actualizada!");
        } catch (err) {
            console.error("Error en la actualización de la contraseña:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    logout: (req, res) => {
        req.logout();
        res.json({ message: "Sesión cerrada exitosamente" });
    },
};

module.exports = UserController;