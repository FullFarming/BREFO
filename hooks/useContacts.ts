import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Contact } from "@/types";

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*, contact_tags(*)")
        .order("name");
      if (error) throw error;
      return data as Contact[];
    },
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: async (): Promise<Contact> => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*, contact_tags(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Contact;
    },
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contact: Omit<Contact, "id" | "user_id" | "created_at" | "tags">) => {
      const { data, error } = await supabase.from("contacts").insert(contact).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}
