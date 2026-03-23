import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { sendMeetingInvite } from "../services/kakao";

export const kakaoRouter = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ⚠️ V1 범위 제한: 카카오 초대는 카카오 로그인 OAuth flow가 앱에 구현되어야
// kakaoAccessToken을 획득할 수 있음. 카카오 로그인 연동은 V2 범위.
// V1에서는 이 엔드포인트를 구현만 하고 앱에서 호출하지 않음.
kakaoRouter.post("/invite", authMiddleware, async (req: AuthRequest, res) => {
  const { meetingId, kakaoAccessToken } = req.body;
  if (!meetingId || !kakaoAccessToken) {
    return res.status(400).json({ error: "meetingId and kakaoAccessToken required" });
  }

  const { data: meeting } = await supabase
    .from("meetings")
    .select("title, scheduled_at, location")
    .eq("id", meetingId)
    .single();

  if (!meeting) return res.status(404).json({ error: "Meeting not found" });

  try {
    await sendMeetingInvite(kakaoAccessToken, {
      title: meeting.title ?? "미팅",
      scheduledAt: meeting.scheduled_at,
      location: meeting.location ?? "",
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Kakao invite failed" });
  }
});
