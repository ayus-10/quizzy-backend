import express from "express";
import { validateQuizInfo } from "../validators/validate-quiz-info";
import {
  deleteQuiz,
  getAllQuizInfo,
  getQuizInfo,
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

router.get(
  "/info/:token",
  authMiddleware,
  decodeUserTokenMiddleware,
  decodeQuizTokenMiddleware,
  getQuizInfo
);

router.get("/info", authMiddleware, decodeUserTokenMiddleware, getAllQuizInfo);

router.post(
  "/questions/:token",
  authMiddleware,
  decodeUserTokenMiddleware,
  decodeQuizTokenMiddleware,
  validateQuizQuestions,
  saveQuizQuestions
);

router.post("/questions", quizQuestionsMiddleware, getQuizQuestions);

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

export default router;
