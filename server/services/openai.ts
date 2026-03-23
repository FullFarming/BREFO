import OpenAI from "openai";
import { NewsArticle } from "./newsapi";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BriefContent {
  attendees: AttendeeInfo[];
  news: { title: string; summary: string; url: string; publishedAt: string; source: string }[];
  trends: string[];
  smalltalk: string[];
}

interface AttendeeInfo {
  contactId: string;
  name: string;
  company: string;
  position: string;
}

export async function generateBrief(
  attendees: AttendeeInfo[],
  allNews: NewsArticle[]
): Promise<BriefContent> {
  const attendeeText = attendees
    .map((a) => `${a.name} (${a.position}, ${a.company})`)
    .join(", ");

  const newsText = allNews
    .slice(0, 10)
    .map((n, i) => `${i + 1}. [${n.source.name}] ${n.title}\n${n.description}`)
    .join("\n\n");

  const prompt = `당신은 비즈니스 미팅 준비를 돕는 AI입니다.
참석자: ${attendeeText}

최신 뉴스:
${newsText}

다음 JSON 형식으로 브리핑을 작성하세요. 신뢰감 있고 간결하게 작성하세요.
{
  "news": [{ "title": "...", "summary": "2-3문장 요약", "url": "...", "publishedAt": "...", "source": "..." }],
  "trends": ["업계 트렌드 1", "트렌드 2", "트렌드 3"],
  "smalltalk": ["자연스러운 스몰톡 소재 1", "소재 2", "소재 3"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const parsed = JSON.parse(response.choices[0].message.content ?? "{}");

  return {
    attendees,
    news: parsed.news ?? [],
    trends: parsed.trends ?? [],
    smalltalk: parsed.smalltalk ?? [],
  };
}
