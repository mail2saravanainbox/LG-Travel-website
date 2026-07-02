import { create } from "zustand";
import { persist } from "zustand/middleware";

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

/**
 * Booking draft shared between the package page and checkout. Persisted to
 * localStorage so the selection survives the full-page Clerk sign-in redirect
 * (a signed-out "Book this trip" click) — otherwise checkout showed "No trip
 * selected yet."
 */
export const useBooking = create<BookingState>()(
  persist(
    (set, get) => ({
      draft: { travelers: 2 },
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      reset: () => set({ draft: { travelers: 2 } }),
      total: () => {
        const { price = 0, travelers = 1 } = get().draft;
        return price * travelers;
      },
    }),
    { name: "lg-booking", partialize: (s) => ({ draft: s.draft }) },
  ),
);
