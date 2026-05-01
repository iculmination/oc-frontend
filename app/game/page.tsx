import { ProtectedRoute } from "@/components/auth/protected-route";
import { GamePlayground } from "@/components/game-playground/game-playground";

export default function GamePage() {
  return (
    <section className="w-full">
      <div className="w-full border border-border bg-card/80 p-2 shadow-[10px_10px_0px_0px_hsl(var(--muted))] backdrop-blur-sm sm:p-3">
        <ProtectedRoute>
          <GamePlayground />
        </ProtectedRoute>
      </div>
    </section>
  );
}
