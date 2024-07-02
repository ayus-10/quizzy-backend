import express from "express";
import { validateQuizInfo } from "../validators/validate-quiz-info";
import { saveQuizInfo } from "../controllers/quiz.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { decodeUserTokenMiddleware } from "../middlewares/decode-user-token.middleware";

const router = express.Router();

router.post(
  "/info",
  authMiddleware,
  decodeUserTokenMiddleware,
  validateQuizInfo,
  saveQuizInfo
);

export default router;
