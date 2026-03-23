import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { searchRestaurants } from "../services/kakao";

export const recommendRouter = Router();

recommendRouter.post("/restaurant", authMiddleware, async (req, res) => {
  const { location } = req.body;
  if (!location) return res.status(400).json({ error: "location required" });

  try {
    const results = await searchRestaurants(location);
    res.json({ restaurants: results.slice(0, 3) });
  } catch (err) {
    res.status(500).json({ error: "Restaurant search failed" });
  }
});
