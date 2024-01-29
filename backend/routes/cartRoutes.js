const express = require("express");
const CartController = require("../controllers/CartController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const cartRoutes = express.Router();
cartRoutes.use("/protected", protectWithJWT);

cartRoutes.post("/protected/comprar", passport.authenticate('jwt', { session: false }), CartController.purchase);

module.exports = cartRoutes;