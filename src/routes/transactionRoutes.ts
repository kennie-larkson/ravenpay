import { Router } from "express";
import {
  sendMoney,
  getTransactionHistory,
  generateAccount,
} from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/generate-account", authenticate, generateAccount);
router.post("/send", sendMoney);
router.get("/history", authenticate, getTransactionHistory);

export default router;
