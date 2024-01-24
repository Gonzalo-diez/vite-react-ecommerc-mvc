const express = require("express");
const ShopController = require("../controllers/ShopController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const shopRoutes = express.Router();
shopRoutes.use("/protected", protectWithJWT);

shopRoutes.post("/protected/comprar", passport.authenticate('jwt', { session: false }), ShopController.purchase);
shopRoutes.get("/protected/compras/:id", passport.authenticate('jwt', { session: false }), ShopController.obtainPurchaseByUser);

module.exports = shopRoutes;