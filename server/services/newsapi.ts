import axios from "axios";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string };
}

export async function fetchNewsByKeyword(keyword: string, count = 5): Promise<NewsArticle[]> {
  const [newsApiResult, naverResult] = await Promise.allSettled([
    fetchFromNewsAPI(keyword, count),
    fetchFromNaver(keyword, count),
  ]);

  const articles: NewsArticle[] = [];
  if (newsApiResult.status === "fulfilled") articles.push(...newsApiResult.value);
  if (naverResult.status === "fulfilled") articles.push(...naverResult.value);

  return articles.slice(0, count);
}

async function fetchFromNewsAPI(keyword: string, count: number): Promise<NewsArticle[]> {
  const res = await axios.get("https://newsapi.org/v2/everything", {
    params: { q: keyword, language: "ko", sortBy: "publishedAt", pageSize: count },
    headers: { "X-Api-Key": process.env.NEWS_API_KEY },
  });
  return res.data.articles ?? [];
}

async function fetchFromNaver(keyword: string, count: number): Promise<NewsArticle[]> {
  const res = await axios.get("https://openapi.naver.com/v1/search/news.json", {
    params: { query: keyword, display: count, sort: "date" },
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
    },
  });
  return (res.data.items ?? []).map((item: any) => ({
    title: item.title.replace(/<[^>]+>/g, ""),
    description: item.description.replace(/<[^>]+>/g, ""),
    url: item.link,
    publishedAt: item.pubDate,
    source: { name: "Naver News" },
  }));
}
