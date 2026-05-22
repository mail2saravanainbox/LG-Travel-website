import { create } from "zustand";

export interface BookingDraft {
  packageSlug: string;
  packageTitle: string;
  price: number;
  currency: string;
  travelers: number;
  startDate: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
}

interface BookingState {
  draft: Partial<BookingDraft>;
  setDraft: (patch: Partial<BookingDraft>) => void;
  reset: () => void;
  total: () => number;
}

/** In-memory booking draft shared between package page and checkout. */
export const useBooking = create<BookingState>()((set, get) => ({
  draft: { travelers: 2 },
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  reset: () => set({ draft: { travelers: 2 } }),
  total: () => {
    const { price = 0, travelers = 1 } = get().draft;
    return price * travelers;
  },
}));
