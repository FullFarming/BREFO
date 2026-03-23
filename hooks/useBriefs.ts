import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Brief } from "@/types";

export function useBriefForMeeting(meetingId: string) {
  return useQuery({
    queryKey: ["briefs", meetingId],
    queryFn: async (): Promise<Brief | null> => {
      const { data, error } = await supabase
        .from("briefs")
        .select("*")
        .eq("meeting_id", meetingId)
        .maybeSingle();
      if (error) throw error;
      return data as Brief | null;
    },
    // 브리핑 생성은 최대 30초 소요 — pending 상태일 때 5초마다 폴링
    refetchInterval: (data) =>
      data?.status === "pending" ? 5000 : false,
  });
}
