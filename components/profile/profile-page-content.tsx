"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppRoute } from "@/lib/constants/app-routes";
import { useAuth } from "@/lib/hooks/use-auth";

export function ProfilePageContent() {
  const { user } = useAuth();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-4xl flex-col gap-4 px-4 py-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4 text-xs text-muted-foreground">
          <p>User ID: {user?.user_id}</p>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
          <p className="pt-2">
            Go to{" "}
            <Link href={AppRoute.Game} className="underline">
              game page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
