import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfilePageContent } from "@/components/profile/profile-page-content";

export default function ProfilePage() {
  return (
    <section className="flex w-full justify-center">
      <div className="w-full max-w-3xl border border-border bg-card/85 p-4 shadow-[8px_8px_0px_0px_hsl(var(--muted))] backdrop-blur-sm sm:p-6">
        <ProtectedRoute>
          <ProfilePageContent />
        </ProtectedRoute>
      </div>
    </section>
  );
}
