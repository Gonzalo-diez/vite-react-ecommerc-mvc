const express = require("express");
const QuestionController = require("../controllers/QuestionController");
const passport = require("../config/passport-jwt-middleware");

const protectWithJWT = passport.authenticate('jwt', { session: false });
const questionRoutes = express.Router();
questionRoutes.use("/protected", protectWithJWT);

questionRoutes.get("/:id", QuestionController.getQuestionById)
questionRoutes.post("/protected/agregarPregunta", protectWithJWT, QuestionController.addQuestion);
questionRoutes.post("/protected/responderPregunta/:id", protectWithJWT, QuestionController.respondQuestion);
questionRoutes.put("/protected/editarPregunta/:id", protectWithJWT, QuestionController.editQuestion);
questionRoutes.delete("/protected/borrarPregunta/:id", protectWithJWT, QuestionController.deleteQuestion);

module.exports = questionRoutes;