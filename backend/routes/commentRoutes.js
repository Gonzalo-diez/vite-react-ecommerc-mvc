const express = require("express");
const CommentController = require("../controllers/CommentController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const commentRoutes = express.Router();
commentRoutes.use("/protected", protectWithJWT);

commentRoutes.get("/ratings", CommentController.getRatings);
commentRoutes.get("/protected/:id", passport.authenticate('jwt', { session: false }), CommentController.getCommentById)
commentRoutes.post("/protected/agregarComentario", passport.authenticate('jwt', { session: false }), CommentController.addComment);
commentRoutes.put("/protected/editarComentario/:id", passport.authenticate('jwt', { session: false }), CommentController.editComment);
commentRoutes.delete("/protected/borrarComentario/:id", passport.authenticate('jwt', { session: false }), CommentController.deleteComment);

module.exports = commentRoutes;