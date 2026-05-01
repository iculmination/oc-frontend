import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfilePageContent } from "@/components/profile/profile-page-content";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
