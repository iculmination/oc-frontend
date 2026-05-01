"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PlayerBoard } from "@/components/game-playground/player-board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api/client";
import { useGame } from "@/lib/hooks/use-game";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CardState = {
  id: string;
  name: string;
  health: number;
  max_health: number;
  attack: number;
  ability: string;
  statuses: string[];
  last_action: string | null;
};

type PlayerState = {
  cards_alive: number;
  cards: CardState[];
};

type EventState = {
  name: string;
  duration: number;
};

type GameSnapshot = {
  status: string;
  turn: number;
  active_player: string;
  winner_id: string | null;
  active_events: EventState[];
  players: Record<string, PlayerState>;
  battle_log: { round: number; actor: string; text: string }[];
};

type StartGameResponse = {
  game_id: string;
  player_id: string;
  bot_id: string;
  state: GameSnapshot;
};

type GameStateResponse = {
  game_id: string;
  player_id: string;
  bot_id: string;
  state: GameSnapshot;
};

type GameSummary = {
  game_id: string;
  status: string;
  turn: number;
  winner_player_id: string | null;
  updated_at: string;
};

type GameListResponse = {
  games: GameSummary[];
};

export function GamePlayground() {
  const { activeGameId, setActiveGame, clearActiveGame } = useGame();

  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [botId, setBotId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [myGames, setMyGames] = useState<GameSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const playerBoard = useMemo(() => {
    if (!snapshot || !playerId) return null;
    return snapshot.players[playerId] ?? null;
  }, [snapshot, playerId]);

  const botBoard = useMemo(() => {
    if (!snapshot || !botId) return null;
    return snapshot.players[botId] ?? null;
  }, [snapshot, botId]);

  const selectedCard = useMemo(() => {
    if (!playerBoard || !selectedCardId) return null;
    return playerBoard.cards.find((card) => card.id === selectedCardId) ?? null;
  }, [playerBoard, selectedCardId]);

  const targetCandidates = useMemo(() => {
    if (!snapshot || !selectedCard || !playerId || !botId) return [];
    if (selectedCard.ability === "attack") return snapshot.players[botId]?.cards ?? [];
    if (selectedCard.ability === "heal" || selectedCard.ability === "buff") {
      return snapshot.players[playerId]?.cards ?? [];
    }
    return [];
  }, [snapshot, selectedCard, playerId, botId]);

  useEffect(() => {
    if (!playerBoard?.cards.length) {
      setSelectedCardId(null);
      return;
    }
    if (!selectedCardId || !playerBoard.cards.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(playerBoard.cards[0].id);
    }
  }, [playerBoard, selectedCardId]);

  useEffect(() => {
    if (!targetCandidates.length) {
      setSelectedTargetId(null);
      return;
    }
    if (!selectedTargetId || !targetCandidates.some((card) => card.id === selectedTargetId)) {
      setSelectedTargetId(targetCandidates[0].id);
    }
  }, [targetCandidates, selectedTargetId]);

  async function startGame() {
    setIsLoading(true);
    try {
      const data = await apiFetch<StartGameResponse>("/game/start-vs-bot", {
        method: "POST",
      });
      setGameId(data.game_id);
      setPlayerId(data.player_id);
      setBotId(data.bot_id);
      setSnapshot(data.state);
      setActiveGame(data.game_id);
      toast.success("Game started");
      await loadMyGames();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start game";
      if (message.includes("already has an active game")) {
        toast.info("You already have an active game, loading it...");
        await loadActiveGame();
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function playTurn() {
    if (!gameId || !selectedCardId) return;

    setIsLoading(true);
    try {
      const data = await apiFetch<GameStateResponse>(`/game/${gameId}/turn`, {
        method: "POST",
        body: JSON.stringify({
          card_id: selectedCardId,
          target_id: selectedTargetId,
        }),
      });
      setGameId(data.game_id);
      setPlayerId(data.player_id);
      setBotId(data.bot_id);
      setSnapshot(data.state);
      if (data.state.status === "finished") {
        clearActiveGame();
      } else {
        setActiveGame(data.game_id);
      }
      if (data.state.status === "finished") {
        toast.success("Game finished");
        await loadMyGames();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to play turn");
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshState() {
    if (!gameId) return;
    setIsLoading(true);
    try {
      const data = await apiFetch<GameStateResponse>(`/game/${gameId}`);
      setPlayerId(data.player_id);
      setBotId(data.bot_id);
      setSnapshot(data.state);
      toast.success("State updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load state");
    } finally {
      setIsLoading(false);
    }
  }

  const loadGameById = useCallback(async function loadGameById(targetGameId: string) {
    setIsLoading(true);
    try {
      const data = await apiFetch<GameStateResponse>(`/game/${targetGameId}`);
      setGameId(data.game_id);
      setPlayerId(data.player_id);
      setBotId(data.bot_id);
      setSnapshot(data.state);
      if (data.state.status === "finished") {
        clearActiveGame();
      } else {
        setActiveGame(data.game_id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load game");
    } finally {
      setIsLoading(false);
    }
  }, [clearActiveGame, setActiveGame]);

  const loadActiveGame = useCallback(async function loadActiveGame() {
    try {
      const active = await apiFetch<GameSummary>("/game/active");
      await loadGameById(active.game_id);
    } catch {
      clearActiveGame();
    }
  }, [clearActiveGame, loadGameById]);

  const loadMyGames = useCallback(async function loadMyGames() {
    try {
      const data = await apiFetch<GameListResponse>("/game/my");
      setMyGames(data.games);
    } catch {
      setMyGames([]);
    }
  }, []);

  async function surrenderGame() {
    if (!gameId) return;
    setIsLoading(true);
    try {
      const data = await apiFetch<GameStateResponse>(`/game/${gameId}/surrender`, {
        method: "POST",
      });
      setSnapshot(data.state);
      clearActiveGame();
      toast.success("You surrendered this game.");
      await loadMyGames();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to surrender");
    } finally {
      setIsLoading(false);
    }
  }

  async function endGame() {
    if (!gameId) return;
    setIsLoading(true);
    try {
      const data = await apiFetch<GameStateResponse>(`/game/${gameId}/end`, {
        method: "POST",
      });
      setSnapshot(data.state);
      clearActiveGame();
      toast.success("Game ended.");
      await loadMyGames();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to end game");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function bootstrapGameSession() {
    void loadMyGames();
    if (activeGameId) {
      void loadGameById(activeGameId);
      return;
    }
    void loadActiveGame();
  }, [activeGameId, loadActiveGame, loadGameById, loadMyGames]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Outer Colony • Local Test Arena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={startGame} disabled={isLoading}>
              Start vs Bot
            </Button>
            <Button
              onClick={playTurn}
              disabled={
                !gameId ||
                !playerId ||
                !selectedCardId ||
                isLoading ||
                snapshot?.status === "finished"
              }
              variant="secondary"
            >
              Play Round
            </Button>
            <Button onClick={refreshState} disabled={!gameId || isLoading} variant="outline">
              Refresh State
            </Button>
            <Button
              onClick={surrenderGame}
              disabled={!gameId || isLoading || snapshot?.status === "finished"}
              variant="destructive"
            >
              Surrender
            </Button>
            <Button
              onClick={endGame}
              disabled={!gameId || isLoading || snapshot?.status === "finished"}
              variant="outline"
            >
              End Game
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Your card action</p>
              <Select
                value={selectedCardId ?? ""}
                onValueChange={(value) => setSelectedCardId(value)}
                disabled={!playerBoard?.cards.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your card" />
                </SelectTrigger>
                <SelectContent>
                  {(playerBoard?.cards ?? []).map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name} ({card.ability})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Target (optional)</p>
              <Select
                value={selectedTargetId ?? "auto"}
                onValueChange={(value) =>
                  setSelectedTargetId(value === "auto" ? null : value)
                }
                disabled={!targetCandidates.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Auto target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto target</SelectItem>
                  {targetCandidates.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1 text-xs text-muted-foreground">
            <p>Game ID: {gameId ?? "-"}</p>
            <p>Player ID: {playerId ?? "-"}</p>
            <p>Bot ID: {botId ?? "-"}</p>
            <p>Status: {snapshot?.status ?? "-"}</p>
            <p>Round: {snapshot?.turn ?? "-"}</p>
            <p>Active Player: {snapshot?.active_player ?? "-"}</p>
            <p>Winner: {snapshot?.winner_id ?? "-"}</p>
            <p>
              Events:{" "}
              {snapshot?.active_events.length
                ? snapshot.active_events.map((event) => `${event.name}(${event.duration})`).join(", ")
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>My Games</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4 text-xs text-muted-foreground">
          {myGames.length ? (
            <div className="space-y-1">
              {myGames.map((game) => (
                <div
                  key={game.game_id}
                  className="flex flex-wrap items-center justify-between gap-2 border border-border px-2 py-1"
                >
                  <div>
                    <p>{game.game_id}</p>
                    <p>
                      {game.status} • round {game.turn}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={function onResumeGame() {
                      void loadGameById(game.game_id);
                    }}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No games yet.</p>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <PlayerBoard
          title="You"
          cardsAlive={playerBoard?.cards_alive ?? 0}
          cards={playerBoard?.cards ?? []}
          isActive={snapshot?.active_player === playerId}
        />
        <PlayerBoard
          title="Bot"
          cardsAlive={botBoard?.cards_alive ?? 0}
          cards={botBoard?.cards ?? []}
          isActive={snapshot?.active_player === botId}
        />
      </section>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Battle Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          {snapshot?.battle_log.length ? (
            <div className="max-h-64 space-y-1 overflow-auto text-xs text-muted-foreground">
              {snapshot.battle_log.map((entry, index) => (
                <p key={`${entry.round}-${entry.actor}-${index}`}>
                  [R{entry.round}] {entry.actor}: {entry.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No battle log entries yet.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
