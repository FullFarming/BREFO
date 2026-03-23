import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
export const recommendRouter = Router();
recommendRouter.post("/restaurant", authMiddleware, async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});
