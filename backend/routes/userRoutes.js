const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/UserController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const userRoutes = express.Router();
userRoutes.use("/protected", protectWithJWT);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "avatar");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


const avatar = multer({ storage: storage });

userRoutes.post("/registro", avatar.single('avatar'), UserController.register);
userRoutes.post("/login", UserController.login);
userRoutes.put("/protected/editarPerfil/:id", protectWithJWT, avatar.single('avatar'), UserController.editUserProfile);
userRoutes.put("/protected/cambiarContrasena/:userId", protectWithJWT, UserController.changeUserPassword);
userRoutes.get("/detalle/:id", UserController.getUserDetail);
userRoutes.get("/protected/:id", protectWithJWT, UserController.getUserById);
userRoutes.get("/protected/productosCreados/:id", protectWithJWT, UserController.getUserProducts);
userRoutes.get("/protected/productosComprados/:id", protectWithJWT, UserController.getUserBoughtProducts);
userRoutes.get("/protected/productosVendidos/:id", protectWithJWT, UserController.getUserSoldProducts);
userRoutes.get("/protected/logout/:id", protectWithJWT, UserController.logout);

module.exports = userRoutes;