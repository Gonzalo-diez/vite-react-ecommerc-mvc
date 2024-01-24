const express = require("express");
const CommentController = require("../controllers/CommentController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const commentRoutes = express.Router();
commentRoutes.use("/protected", protectWithJWT);

commentRoutes.post("/protected/comentarios/agregar", passport.authenticate('jwt', { session: false }), CommentController.addComment);
commentRoutes.put("/protected/comentarios/editar/:id", passport.authenticate('jwt', { session: false }), CommentController.editComment);
commentRoutes.delete("/protected/comentarios/borrar/:id", passport.authenticate('jwt', { session: false }), CommentController.deleteComment);

module.exports = commentRoutes;