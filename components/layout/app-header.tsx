"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AppRoute } from "@/lib/constants/app-routes";
import { useAuth } from "@/lib/hooks/use-auth";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 text-xs">
        <div className="flex items-center gap-3">
          <Link href={AppRoute.Home} className="font-semibold">
            Outer Colony
          </Link>
          <Link href={AppRoute.Game} className="text-muted-foreground hover:text-foreground">
            Game
          </Link>
          <Link href={AppRoute.Profile} className="text-muted-foreground hover:text-foreground">
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-muted-foreground">{user.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href={AppRoute.Auth}>
              <Button size="sm">Auth</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
