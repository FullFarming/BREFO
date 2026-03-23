import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { fetchNewsByKeyword } from "../services/newsapi";
import { generateBrief } from "../services/openai";

export const briefRouter = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

briefRouter.post("/generate", authMiddleware, async (req: AuthRequest, res) => {
  const { meetingId, contactIds, language = "ko" } = req.body;

  if (!meetingId || !contactIds?.length) {
    return res.status(400).json({ error: "meetingId and contactIds required" });
  }

  // briefs 상태를 pending으로 초기화
  const { data: brief, error: insertErr } = await supabase
    .from("briefs")
    .upsert({ meeting_id: meetingId, status: "pending" })
    .select()
    .single();

  if (insertErr) return res.status(500).json({ error: insertErr.message });

  // 즉시 202 반환 (비동기 처리)
  res.status(202).json({ briefId: brief.id, status: "pending" });

  // 백그라운드에서 브리핑 생성
  try {
    // 참석자 정보 조회
    const { data: contacts } = await supabase
      .from("contacts")
      .select("id, name, company, position")
      .in("id", contactIds);

    const attendees = (contacts ?? []).map((c: any) => ({
      contactId: c.id,
      name: c.name,
      company: c.company ?? "",
      position: c.position ?? "",
    }));

    // 뉴스 수집 (참석자별 회사명으로 검색)
    const keywords = [...new Set(attendees.map((a) => a.company).filter(Boolean))];
    const allNews = (
      await Promise.all(keywords.map((kw) => fetchNewsByKeyword(kw, 3)))
    ).flat();

    // GPT-4o 브리핑 생성
    const content = await generateBrief(attendees, allNews);

    // 결과 저장
    await supabase
      .from("briefs")
      .update({ content, status: "ready", generated_at: new Date().toISOString() })
      .eq("id", brief.id);
  } catch (err) {
    console.error("Brief generation failed:", err);
    await supabase.from("briefs").update({ status: "failed" }).eq("id", brief.id);
  }
});
