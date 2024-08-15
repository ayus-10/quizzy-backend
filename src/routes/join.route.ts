import { Router } from "express";
import {
  getResult,
  joinQuiz,
  submitQuiz,
  verifyJoin,
} from "../controllers/join.controller";
import { quizQuestionsMiddleware } from "../middlewares/quiz-questions.middleware";
import { validateQuizSubmission } from "../validators/validate-quiz-submission";

const router = Router();

router.post("/verify", quizQuestionsMiddleware, verifyJoin);

router.post("/quiz", joinQuiz);

router.post("/submit", validateQuizSubmission, submitQuiz);

router.get("/result", getResult);

export default router;
