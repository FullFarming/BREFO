import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Meeting } from "@/types";

export function useTodayMeetings() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return useQuery({
    queryKey: ["meetings", "today"],
    queryFn: async (): Promise<Meeting[]> => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*, meeting_contacts(contact_id, contacts(*))")
        .gte("scheduled_at", today.toISOString())
        .lt("scheduled_at", tomorrow.toISOString())
        .order("scheduled_at");
      if (error) throw error;
      return data as Meeting[];
    },
  });
}

export function useCreateMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      meeting,
      contactIds,
    }: {
      meeting: Omit<Meeting, "id" | "user_id" | "created_at" | "contacts" | "brief">;
      contactIds: string[];
    }) => {
      const { data, error } = await supabase
        .from("meetings")
        .insert(meeting)
        .select()
        .single();
      if (error) throw error;

      if (contactIds.length > 0) {
        const links = contactIds.map((cid) => ({ meeting_id: data.id, contact_id: cid }));
        await supabase.from("meeting_contacts").insert(links);
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      qc.invalidateQueries({ queryKey: ["briefs"] });
    },
  });
}
