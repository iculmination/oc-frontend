"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppRoute } from "@/lib/constants/app-routes";
import { useGameStore } from "@/lib/stores/game-store";

export function useGame() {
  const router = useRouter();
  const activeGameId = useGameStore(function selectActiveGameId(state) {
    return state.activeGameId;
  });
  const setActiveGameIdStore = useGameStore(function selectSetActiveGameId(state) {
    return state.setActiveGameId;
  });

  const setActiveGame = useCallback(function setActiveGame(gameId: string | null) {
    setActiveGameIdStore(gameId);
  }, [setActiveGameIdStore]);

  const clearActiveGame = useCallback(function clearActiveGame() {
    setActiveGameIdStore(null);
  }, [setActiveGameIdStore]);

  const openGamePage = useCallback(function openGamePage() {
    router.push(AppRoute.Game);
  }, [router]);

  const resumeGame = useCallback(function resumeGame(gameId: string) {
    setActiveGame(gameId);
    openGamePage();
    toast.success("Game session restored");
  }, [openGamePage, setActiveGame]);

  return {
    activeGameId,
    setActiveGame,
    clearActiveGame,
    openGamePage,
    resumeGame,
  };
}
