import { Router } from "express";
import { usersMiddleware } from "../middlewares/users.middleware";
import {
  loginController,
  registerController,
} from "../controllers/users.controller";

const router = Router();

router.post("/register", usersMiddleware, registerController);

router.post("/login", usersMiddleware, loginController);

export default router;
