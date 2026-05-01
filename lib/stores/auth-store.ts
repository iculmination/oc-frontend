"use client";

import { create } from "zustand";

import { apiFetch } from "@/lib/api/client";

type AuthUser = {
  user_id: string;
  username: string;
  email: string;
};

type AuthResponse = {
  message: string;
  user_id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  isHydrating: boolean;
  hasHydrated: boolean;
  register: (payload: {
    username: string;
    email: string;
    password: string;
  }) => Promise<AuthResponse>;
  login: (payload: { email: string; password: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<AuthUser>;
  refresh: () => Promise<AuthResponse>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isHydrating: false,
  hasHydrated: false,

  register: async (payload) => {
    const response = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    set({
      user: {
        user_id: response.user_id,
        username: response.username,
        email: response.email,
      },
    });
    return response;
  },

  login: async (payload) => {
    const response = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    set({
      user: {
        user_id: response.user_id,
        username: response.username,
        email: response.email,
      },
    });
    return response;
  },

  logout: async () => {
    await apiFetch<void>("/auth/logout", { method: "POST" });
    set({ user: null });
  },

  fetchMe: async () => {
    const user = await apiFetch<AuthUser>("/auth/me", { skipAuthRetry: true });
    set({ user });
    return user;
  },

  refresh: async () => {
    return apiFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      skipAuthRetry: true,
    });
  },

  hydrate: async () => {
    if (get().isHydrating || get().hasHydrated) return;
    set({ isHydrating: true });
    try {
      await get().fetchMe();
    } catch {
      try {
        await get().refresh();
        await get().fetchMe();
      } catch {
        set({ user: null });
      }
    } finally {
      set({ isHydrating: false, hasHydrated: true });
    }
  },
}));
