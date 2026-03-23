import { create } from "zustand";
import { MeetingDraft } from "@/types";

interface MeetingStoreState {
  draft: MeetingDraft;
  setStep: (step: MeetingDraft["step"]) => void;
  updateDraft: (partial: Partial<MeetingDraft>) => void;
  resetDraft: () => void;
}

const initialDraft: MeetingDraft = {
  step: 1,
  contactIds: [],
  title: "",
  scheduledAt: new Date(Date.now() + 86400000).toISOString(), // 내일 기본값
  location: "",
  notes: "",
};

export const useMeetingStore = create<MeetingStoreState>((set) => ({
  draft: initialDraft,
  setStep: (step) => set((s) => ({ draft: { ...s.draft, step } })),
  updateDraft: (partial) => set((s) => ({ draft: { ...s.draft, ...partial } })),
  resetDraft: () => set({ draft: initialDraft }),
}));
