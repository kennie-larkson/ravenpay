import { Router } from "express";
import { signUp, logIn } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);

export default router;
