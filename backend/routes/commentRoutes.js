const express = require("express");
const CommentController = require("../controllers/CommentController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const commentRoutes = express.Router();
commentRoutes.use("/protected", protectWithJWT);

commentRoutes.get("/ratings", CommentController.getRatings);
commentRoutes.get("/:id", CommentController.getCommentById)
commentRoutes.post("/protected/agregarComentario", protectWithJWT, CommentController.addComment);
commentRoutes.post("/protected/responderComentario/:id", protectWithJWT, CommentController.respondComment);
commentRoutes.put("/protected/editarComentario/:id", protectWithJWT, CommentController.editComment);
commentRoutes.delete("/protected/borrarComentario/:id", protectWithJWT, CommentController.deleteComment);

module.exports = commentRoutes;