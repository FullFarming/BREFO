import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
export const kakaoRouter = Router();
kakaoRouter.post("/invite", authMiddleware, async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});
