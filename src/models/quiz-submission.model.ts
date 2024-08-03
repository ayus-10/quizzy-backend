import { model, Schema } from "mongoose";

const quizSubmissionSchema = new Schema(
  {
    quizId: {
      type: String,
      required: true,
    },
    submittedBy: {
      type: String,
      required: true,
    },
    submittedQuestions: [
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
    ],
  },
  { timestamps: true }
);

export const QuizSubmissionModel = model(
  "quiz-submission",
  quizSubmissionSchema
);
