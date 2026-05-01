"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppRoute } from "@/lib/constants/app-routes";
import { useAuth } from "@/lib/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, hasHydrated } = useAuth();

  useEffect(function handleProtectedRedirect() {
    if (!hasHydrated) return;
    if (!user) router.replace(AppRoute.Auth);
  }, [hasHydrated, router, user]);

  if (!hasHydrated) {
    return <div className="p-6 text-xs text-muted-foreground">Loading session...</div>;
  }

  if (!user) return null;

  return <>{children}</>;
}
