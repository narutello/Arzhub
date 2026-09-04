import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULTS = ["USD", "EUR", "AED", "TRY"];

type WatchlistState = {
  codes: string[];
  hydrated: boolean;
  toggle: (code: string) => void;
  has: (code: string) => boolean;
  setHydrated: () => void;
};

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      codes: DEFAULTS,
      hydrated: false,
      toggle: (code) => {
        const next = code.toUpperCase();
        set((s) => ({
          codes: s.codes.includes(next)
            ? s.codes.filter((c) => c !== next)
            : [next, ...s.codes],
        }));
      },
      has: (code) => get().codes.includes(code.toUpperCase()),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "arzhub-watchlist",
      partialize: (s) => ({ codes: s.codes }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
