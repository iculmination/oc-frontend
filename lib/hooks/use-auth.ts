"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { AppRoute } from "../constants/app-routes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const logoutFetch = useAuthStore((state) => state.logout);
  const meFetch = useAuthStore((state) => state.fetchMe);
  const refreshFetch = useAuthStore((state) => state.refresh);
  const hydrate = useAuthStore((state) => state.hydrate);

  async function logout() {
    try {
      await logoutFetch();
      toast.success("Logged out");
      router.push(AppRoute.Auth);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    }
  }

  async function me() {
    try {
      await meFetch();
      toast.success("Session is active");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Not authenticated");
    }
  }

  async function refresh() {
    try {
      await refreshFetch();
      await meFetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Refresh failed");
    }
  }

  return {
    user,
    isHydrating,
    hasHydrated,
    register,
    login,
    logout,
    me,
    refresh,
    hydrate,
  };
}
