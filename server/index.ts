import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { briefRouter } from "./routes/brief";
import { newsRouter } from "./routes/news";
import { recommendRouter } from "./routes/recommend";
import { kakaoRouter } from "./routes/kakao";

dotenv.config();

const app = express();
app.use(cors({ origin: false }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/brief", briefRouter);
app.use("/news", newsRouter);
app.use("/recommend", recommendRouter);
app.use("/kakao", kakaoRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`BREFO AI Server running on :${PORT}`));
