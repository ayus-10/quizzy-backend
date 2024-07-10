import express from "express";
import { validateQuizInfo } from "../validators/validate-quiz-info";
import {
  getQuizInfo,
  saveQuizInfo,
  saveQuizQuestions,
} from "../controllers/quiz.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { decodeUserTokenMiddleware } from "../middlewares/decode-user-token.middleware";
import { decodeQuizTokenMiddleware } from "../middlewares/decode-quiz-token.middleware";
import { validateQuizQuestions } from "../validators/validate-quiz-questions";

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
  getQuizInfo
);

router.post(
  "/questions",
  authMiddleware,
  decodeUserTokenMiddleware,
  decodeQuizTokenMiddleware,
  validateQuizQuestions,
  saveQuizQuestions
);

export default router;
