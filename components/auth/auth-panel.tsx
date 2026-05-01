"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthResponse = {
  message: string;
  user_id: string;
  username: string;
  email: string;
};

type MeResponse = {
  user_id: string;
  username: string;
  email: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [me, setMe] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      let detail = `Request failed: ${response.status}`;
      try {
        const body = (await response.json()) as { detail?: string };
        if (body.detail) detail = body.detail;
      } catch {
        // ignore parsing errors
      }
      throw new Error(detail);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  async function onRegister() {
    setIsLoading(true);
    try {
      const data = await request<AuthResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      });
      toast.success(data.message);
      await onMe();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Register failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function onLogin() {
    setIsLoading(true);
    try {
      const data = await request<AuthResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      toast.success(data.message);
      await onMe();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function onRefresh() {
    setIsLoading(true);
    try {
      const data = await request<AuthResponse>("auth/refresh", {
        method: "POST",
      });
      toast.success(data.message);
      await onMe();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Refresh failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function onLogout() {
    setIsLoading(true);
    try {
      await request("auth/logout", { method: "POST" });
      setMe(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function onMe() {
    setIsLoading(true);
    try {
      const data = await request<MeResponse>("auth/me");
      setMe(data);
      toast.success("Session is active");
    } catch (error) {
      setMe(null);
      toast.error(error instanceof Error ? error.message : "Not authenticated");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Auth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            placeholder="Username (for register)"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={onRegister} disabled={isLoading}>
              Register
            </Button>
            <Button onClick={onLogin} disabled={isLoading} variant="secondary">
              Login
            </Button>
            <Button onClick={onRefresh} disabled={isLoading} variant="outline">
              Refresh
            </Button>
            <Button onClick={onMe} disabled={isLoading} variant="outline">
              Me
            </Button>
            <Button onClick={onLogout} disabled={isLoading} variant="destructive">
              Logout
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Cookies are HttpOnly. The browser sends them automatically with{" "}
            <code>credentials: include</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Current Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 pt-4 text-xs text-muted-foreground">
          {me ? (
            <>
              <p>User ID: {me.user_id}</p>
              <p>Username: {me.username}</p>
              <p>Email: {me.email}</p>
              <p className="pt-2">
                Open game arena:{" "}
                <Link href="/" className="underline">
                  /
                </Link>
              </p>
            </>
          ) : (
            <p>No active session.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
