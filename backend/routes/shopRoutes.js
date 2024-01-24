const express = require("express");
const ShopController = require("../controllers/ShopController");
const passport = require("passport");

const shopRoutes = express.Router();

shopRoutes.post("/protected/comprar", passport.authenticate('jwt', { session: false }), ShopController.purchase);
shopRoutes.get("/protected/compras/:id", passport.authenticate('jwt', { session: false }), ShopController.obtainPurchaseByUser);

module.exports = shopRoutes;