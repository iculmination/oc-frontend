"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppRoute } from "@/lib/constants/app-routes";
import { useAuth } from "@/lib/hooks/use-auth";

interface GuestOnlyProps {
  children: React.ReactNode;
};

export function GuestOnly({ children }: GuestOnlyProps) {
  const router = useRouter();
  const { user, hasHydrated } = useAuth();

  useEffect(function handleGuestRedirect() {
    if (!hasHydrated) return;
    if (user) router.replace(AppRoute.Profile);
  }, [hasHydrated, router, user]);

  if (!hasHydrated) {
    return <div className="p-6 text-xs text-muted-foreground">Loading session...</div>;
  }

  if (user) return null;

  return children
}
