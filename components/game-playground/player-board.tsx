"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type PlayerBoardProps = {
  title: string;
  cardsAlive: number;
  cards: CardState[];
  isActive: boolean;
};

export function PlayerBoard({ title, cardsAlive, cards, isActive }: PlayerBoardProps) {
  return (
    <Card className={isActive ? "ring-2 ring-primary/40" : undefined}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-muted-foreground">Alive: {cardsAlive}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        {cards.length === 0 ? (
          <p className="text-xs text-muted-foreground">No cards on board.</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="border border-border px-2 py-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{card.name}</p>
                <p className="text-xs text-muted-foreground">
                  HP {card.health}/{card.max_health}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                ATK {card.attack} • {card.ability}
              </p>
              <p className="text-xs text-muted-foreground">
                Effects: {card.statuses.length ? card.statuses.join(", ") : "none"}
              </p>
              <p className="text-xs text-muted-foreground">
                Last action: {card.last_action ?? "No action in previous round"}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
