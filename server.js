// Require modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Environment variables
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

// Initialize express
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
const createRoute = require("./routes/create");
const quizRoute = require("./routes/quiz");
app.use("/create", createRoute);
app.use("/quiz", quizRoute);

// Start the server
mongoose.connect(DB_URI).then(() => {
  app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
  });
});
