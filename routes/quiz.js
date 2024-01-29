const quiz = require("../models/quizzes");
const express = require("express");

const router = express.Router();

router.use(async (req, res, next) => {
  const credentials = req.body;
  const quizData = await quiz.findOne({ id: credentials.id });
  if (quizData) {
    if (quizData.password === credentials.password) {
      req.credentials = credentials;
      req.questions = quizData.questions;
      next();
    } else {
      res.status(400).send("Invalid Password");
    }
  } else {
    res.status(400).send("Invalid ID");
  }
});

router.post("/credentials", async (req, res) => {
  res.status(200).json(req.credentials);
});

router.post("/questions", async (req, res) => {
  res.status(200).json(req.questions);
});

module.exports = router;
