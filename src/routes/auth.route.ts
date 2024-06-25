import { Router } from "express";
import { tokenController } from "../controllers/auth.controller";

const router = Router();

router.post("/token", tokenController);

export default router;
