import { RequestHandler } from "express";
import { QuizQuestion } from "../interfaces/quiz-question.interface";

export const validateQuizQuestions: RequestHandler = async (req, res, next) => {
  const {
    quizToken,
    quizQuestions,
  }: { quizToken: string; quizQuestions: QuizQuestion[] } = req.body;

  const requestBodyValid =
    Array.isArray(quizQuestions) &&
    quizQuestions.every((q) => Array.isArray(q.answerChoices));

  if (!requestBodyValid) {
    return res.status(400).send("Invalid data format");
  }

  const questionsValid = quizQuestions.every(
    (q) => typeof q.question === "string" && q.question !== ""
  );

  if (!questionsValid) {
    return res.status(400).send("Make sure all the questions are non empty");
  }

  const answersValid = quizQuestions.every((q) =>
    q.answerChoices.every((a) => typeof a === "string" && a !== "")
  );

  if (!answersValid) {
    return res
      .status(400)
      .send("Make sure all the answer choices are non empty");
  }

  const correctChoiceValid = quizQuestions.every(
    (q) =>
      typeof q.correctChoice === "number" &&
      q.correctChoice > 0 &&
      q.correctChoice <= q.answerChoices.length
  );

  if (!correctChoiceValid) {
    return res.status(400).send("Make sure all the correct choice are valid");
  }

  next();
};
