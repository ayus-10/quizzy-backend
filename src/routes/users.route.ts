import { Router } from "express";
import { registerController } from "../controllers/users.controller";

const router = Router();

router.post("/register", registerController);

export default router;
