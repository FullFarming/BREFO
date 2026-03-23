import axios from "axios";

const KAKAO_BASE = "https://dapi.kakao.com/v2/local";
const KAKAO_MESSAGE_BASE = "https://kapi.kakao.com/v2/api/talk";

export async function searchRestaurants(query: string, x?: string, y?: string) {
  const params: any = { query, category_group_code: "FD6", size: 5 };
  if (x && y) { params.x = x; params.y = y; params.radius = 1000; }

  const res = await axios.get(`${KAKAO_BASE}/search/keyword.json`, {
    params,
    headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
  });
  return res.data.documents ?? [];
}

export async function sendMeetingInvite(
  accessToken: string,
  meetingInfo: { title: string; scheduledAt: string; location: string }
) {
  const message = {
    object_type: "text",
    text: `[BREFO] 미팅 초대\n${meetingInfo.title}\n📅 ${new Date(meetingInfo.scheduledAt).toLocaleString("ko-KR")}\n📍 ${meetingInfo.location}`,
    link: { web_url: "https://brefo.app", mobile_web_url: "https://brefo.app" },
  };

  const res = await axios.post(
    `${KAKAO_MESSAGE_BASE}/memo/default/send`,
    { template_object: JSON.stringify(message) },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.data;
}
