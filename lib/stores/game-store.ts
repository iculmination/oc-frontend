"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameStoreState = {
  activeGameId: string | null;
  setActiveGameId: (gameId: string | null) => void;
};

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      activeGameId: null,
      setActiveGameId: function setActiveGameId(gameId) {
        set({ activeGameId: gameId });
      },
    }),
    {
      name: "oc-active-game",
      partialize: function partialize(state) {
        return { activeGameId: state.activeGameId };
      },
    }
  )
);
