import { Router } from "express";
import {
  refreshUserTokens,
  getUserEmail,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { decodeUserTokenMiddleware } from "../middlewares/decode-user-token.middleware";

const router = Router();

router.get("/token", authMiddleware, refreshUserTokens);

router.get("/user", authMiddleware, decodeUserTokenMiddleware, getUserEmail);

export default router;
