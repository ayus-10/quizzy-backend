const { Schema, model } = require("mongoose");

const answerSchema = new Schema(
  {
    answerText: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    answers: [answerSchema],
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
