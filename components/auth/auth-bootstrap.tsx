"use client";

import { useEffect } from "react";

import { useAuth } from "@/lib/hooks/use-auth";

export function AuthBootstrap() {
  const { hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
