import { Schema, model } from "mongoose";

const QuizInfoSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    password: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const QuizInfoModel = model("quiz-info", QuizInfoSchema);
