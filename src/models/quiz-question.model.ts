import { Schema, model } from "mongoose";

const QuizQuestionSchema = new Schema(
  {
    quizId: { type: String, required: true },
    question: { type: String, required: true },
    answerChoices: [{ type: String, required: true }],
    correctChoice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const QuizQuestionModel = model("quiz-question", QuizQuestionSchema);
