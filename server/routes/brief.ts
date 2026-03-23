import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
export const briefRouter = Router();
briefRouter.post("/generate", authMiddleware, async (req, res) => {
  // Task 11에서 구현
  res.status(501).json({ message: "Not implemented" });
});
