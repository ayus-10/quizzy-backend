import express from "express";
import { validateQuizInfo } from "../validators/validate-quiz-info";
import { getQuizInfo, saveQuizInfo } from "../controllers/quiz.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { decodeUserTokenMiddleware } from "../middlewares/decode-user-token.middleware";

const router = express.Router();

router.post(
  "/save-info",
  authMiddleware,
  decodeUserTokenMiddleware,
  validateQuizInfo,
  saveQuizInfo
);

router.post(
  "/get-info",
  authMiddleware,
  decodeUserTokenMiddleware,
  getQuizInfo
);

export default router;
