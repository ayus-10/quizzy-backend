import { Router } from "express";
import {
  joinQuiz,
  submitQuiz,
  verifyJoin,
} from "../controllers/join.controller";
import { quizQuestionsMiddleware } from "../middlewares/quiz-questions.middleware";
import { validateQuizSubmission } from "../validators/validate-quiz-submission";

const router = Router();

router.post("/verify", quizQuestionsMiddleware, verifyJoin);

router.get("/quiz/:token", joinQuiz);

router.post("/submit/:token", validateQuizSubmission, submitQuiz);

export default router;
