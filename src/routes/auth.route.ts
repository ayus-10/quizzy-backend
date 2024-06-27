import { Router } from "express";
import {
  tokenController,
  userController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/token", authMiddleware, tokenController);

router.get("/user", authMiddleware, userController);

export default router;
