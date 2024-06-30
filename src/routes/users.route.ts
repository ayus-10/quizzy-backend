import { Router } from "express";
import { usersMiddleware } from "../middlewares/users.middleware";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/users.controller";

const router = Router();

router.post("/register", usersMiddleware, registerUser);

router.post("/login", usersMiddleware, loginUser);

router.get("/logout", logoutUser);

export default router;
