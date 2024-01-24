const express = require("express");
const path = require("path");
const multer = require("multer");
const UserController = require("../controllers/UserController");
const passport = require("passport");

const userRoutes = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "avatar");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const avatar = multer({ storage: storage });

userRoutes.post("/registro", avatar.single('avatar'), UserController.register);
userRoutes.post("/login", UserController.login);
userRoutes.put("/protected/editarPerfil/:userId", passport.authenticate('jwt', { session: false }), avatar.single('avatar'), UserController.editUserProfile);
userRoutes.put("/protected/cambiarContrasena/:userId", passport.authenticate('jwt', { session: false }), UserController.changeUserPassword);
userRoutes.get("/detalle/:id", UserController.getUserDetail);
userRoutes.get("/protected/productos-creados/:usuarioId", passport.authenticate('jwt', { session: false }), UserController.getUserCreatedProducts);
userRoutes.get("/protected/productos-comprados/:usuarioId", passport.authenticate('jwt', { session: false }), UserController.getUserBoughtProducts);
userRoutes.get("/protected/productos-vendidos/:usuarioId", passport.authenticate('jwt', { session: false }), UserController.getUserSoldProducts);
userRoutes.get("/info/:userId", UserController.getUserInfo);
userRoutes.get("/protected/logout", passport.authenticate('jwt', { session: false }), UserController.logout);

module.exports = userRoutes;