const quiz = require("../models/quizzes");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  const credentials = req.body;
  const quizData = await quiz.findOne({ id: credentials.id });
  if (quizData) {
    if (quizData.password === credentials.password) {
      res.status(200).json(quizData.questions);
    } else {
      res.status(400).send("Invalid Password");
    }
  } else {
    res.status(400).send("Invalid ID");
  }
});

module.exports = router;
