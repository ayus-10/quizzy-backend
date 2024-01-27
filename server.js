// Require modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const generatePassword = require("generate-password");
const quiz = require("./models/quizzes");
require("dotenv").config();

// Environment variables
const DB_URI = process.env.DB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;

// Initialize express
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post("/create", async (req, res) => {
  const questions = req.body;

  const id = generatePassword.generate({
    length: 8,
    numbers: true,
    lowercase: false,
    uppercase: false,
  });

  const password = generatePassword.generate({
    length: 8,
  });

  const quizBody = {
    id: id,
    password: password,
    questions: questions,
  };

  const newQuiz = new quiz(quizBody);

  await newQuiz.save();

  res.status(200).json({
    message: "Your quiz was created successfully!",
    id: id,
    password: password,
  });
});

// Start the server
mongoose.connect(DB_URI).then(() => {
  app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
  });
});
