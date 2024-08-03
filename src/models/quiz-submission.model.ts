import { model, Schema } from "mongoose";

const quizSubmissionSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    selectedAnswerNumber: {
      type: Number,
      required: true,
    },
    correctAnswerNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const QuizSubmissionModel = model(
  "quiz-submission",
  quizSubmissionSchema
);
