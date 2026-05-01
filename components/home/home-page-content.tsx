import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppRoute } from "@/lib/constants/app-routes";

export function HomePageContent() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-6xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Welcome to Outer Colony</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-muted-foreground">
          <p>
            Turn-based card skirmish with dynamic events, round logs, and ability interactions.
          </p>
          <div className="flex gap-2">
            <Link href={AppRoute.Game}>
              <Button>Open Game</Button>
            </Link>
            <Link href={AppRoute.Auth}>
              <Button variant="outline">Open Auth</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
