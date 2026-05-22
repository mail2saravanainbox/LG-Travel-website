import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
}

/** Persisted admin session (token in localStorage). */
export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      setAuth: (token, username) => set({ token, username }),
      logout: () => set({ token: null, username: null }),
    }),
    { name: "lg-admin" },
  ),
);
