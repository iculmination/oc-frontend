import { AuthPanel } from "@/components/auth/auth-panel";
import { GuestOnly } from "@/components/auth/guest-only";

export default function AuthPage() {
  return (
    <section className="flex w-full items-center justify-center">
      <div className="w-full max-w-md border border-border bg-card/85 p-4 shadow-[8px_8px_0px_0px_hsl(var(--muted))] backdrop-blur-sm sm:p-6">
        <GuestOnly>
          <AuthPanel />
        </GuestOnly>
      </div>
    </section>
  );
}
