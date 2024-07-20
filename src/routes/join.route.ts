import { Router } from "express";
import { joinQuiz, verifyJoin } from "../controllers/join.controller";
import { quizQuestionsMiddleware } from "../middlewares/quiz-questions.middleware";

const router = Router();

router.post("/verify", quizQuestionsMiddleware, verifyJoin);

router.get("/quiz/:token", joinQuiz);

export default router;
