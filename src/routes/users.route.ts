import { Router } from "express";
import { usersMiddleware } from "../middlewares/users.middleware";
import {
  loginController,
  registerController,
  logoutController,
} from "../controllers/users.controller";

const router = Router();

router.post("/register", usersMiddleware, registerController);

router.post("/login", usersMiddleware, loginController);

router.get("/logout", logoutController);

export default router;
