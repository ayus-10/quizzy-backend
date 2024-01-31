const { Schema, model } = require("mongoose");

const questionSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    answers: [String],
    correctAnswer: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const quizSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const quiz = model("quiz", quizSchema);

module.exports = quiz;
