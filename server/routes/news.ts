import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
export const newsRouter = Router();
newsRouter.get("/:contactId", authMiddleware, async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});
