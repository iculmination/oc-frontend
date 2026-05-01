"use client";

import Link from "next/link";
import { useState } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppRoute } from "@/lib/constants/app-routes";
import { useAuth } from "@/lib/hooks/use-auth";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { user, me, refresh, logout, isHydrating } = useAuth();



  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Auth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setMode("login")}
              variant={mode === "login" ? "default" : "outline"}
            >
              Login form
            </Button>
            <Button
              onClick={() => setMode("register")}
              variant={mode === "register" ? "default" : "outline"}
            >
              Register form
            </Button>
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={refresh} disabled={isHydrating} variant="outline">
              Refresh
            </Button>
            <Button onClick={me} disabled={isHydrating} variant="outline">
              Me
            </Button>
            <Button onClick={logout} disabled={isHydrating} variant="destructive">
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
          {user ? (
            <>
              <p>User ID: {user.user_id}</p>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p className="pt-2">
                Open game arena:{" "}
                <Link href={AppRoute.Game} className="underline">
                  /game
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
