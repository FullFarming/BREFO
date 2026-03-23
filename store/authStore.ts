import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  userId: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  userId: null,
  setSession: (session) =>
    set({ session, userId: session?.user?.id ?? null }),
}));
