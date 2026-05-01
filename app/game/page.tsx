import { ProtectedRoute } from "@/components/auth/protected-route";
import { GamePlayground } from "@/components/game-playground/game-playground";

export default function GamePage() {
  return (
    <ProtectedRoute>
      <GamePlayground />
    </ProtectedRoute>
  );
}
