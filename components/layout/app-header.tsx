"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AppRoute } from "@/lib/constants/app-routes";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="relative border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 text-xs">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={AppRoute.Home}
            className="border border-border bg-card px-2 py-1 font-semibold tracking-wide uppercase"
          >
            Outer Colony // Alpha
          </Link>
          <Link
            href={AppRoute.Game}
            className={cn(
              "border border-transparent px-2 py-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground",
              pathname === AppRoute.Game && "border-border bg-card text-foreground",
            )}
          >
            [ Game ]
          </Link>
          <Link
            href={AppRoute.Profile}
            className={cn(
              "border border-transparent px-2 py-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground",
              pathname === AppRoute.Profile && "border-border bg-card text-foreground",
            )}
          >
            [ Profile ]
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <span className="hidden border border-border/70 bg-card px-2 py-1 text-muted-foreground sm:inline-flex">
                Pilot: {user.username}
              </span>
              <Button variant="outline" size="sm" onClick={logout} className="uppercase">
                Log Out
              </Button>
            </>
          ) : (
            <Link href={AppRoute.Auth}>
              <Button size="sm" className="uppercase">
                Auth
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
