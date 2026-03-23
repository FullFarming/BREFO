import axios from "axios";
import { supabase } from "./supabase";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_AI_SERVER_URL,
  timeout: 30000,
});

// 매 요청마다 최신 JWT 자동 첨부
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
