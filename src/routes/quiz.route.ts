import express from "express";
import { validateQuizInfo } from "../validators/validate-quiz-info";
import {
  deleteQuiz,
  getAllQuizInfo,
  getQuestionsFromId,
  getQuizQuestions,
  saveQuizInfo,
  saveQuizQuestions,
  updateQuizQuestions,
} from "../controllers/quiz.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { decodeUserTokenMiddleware } from "../middlewares/decode-user-token.middleware";
import { decodeQuizTokenMiddleware } from "../middlewares/decode-quiz-token.middleware";
import { validateQuizQuestions } from "../validators/validate-quiz-questions";
import { quizQuestionsMiddleware } from "../middlewares/quiz-questions.middleware";
import { manageQuizMiddleware } from "../middlewares/manage-quiz.middleware";

const router = express.Router();

router.post(
  "/info",
  authMiddleware,
  decodeUserTokenMiddleware,
  validateQuizInfo,
  saveQuizInfo
);

router.get("/info", authMiddleware, decodeUserTokenMiddleware, getAllQuizInfo);

router.post(
  "/questions",
  authMiddleware,
  decodeUserTokenMiddleware,
  decodeQuizTokenMiddleware,
  validateQuizQuestions,
  saveQuizQuestions
);

router.get(
  "/questions",
  authMiddleware,
  decodeUserTokenMiddleware,
  quizQuestionsMiddleware,
  getQuizQuestions
);

router.delete(
  "/:id",
  authMiddleware,
  decodeUserTokenMiddleware,
  manageQuizMiddleware,
  deleteQuiz
);

router.patch(
  "/questions/:id",
  authMiddleware,
  decodeUserTokenMiddleware,
  manageQuizMiddleware,
  validateQuizQuestions,
  updateQuizQuestions
);

router.post("/questions/:quizId", getQuestionsFromId);

export default router;
