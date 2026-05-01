import { AuthPanel } from "@/components/auth/auth-panel";
import { GuestOnly } from "@/components/auth/guest-only";

export default function AuthPage() {
  return (
    <GuestOnly>
      <AuthPanel />
    </GuestOnly>
  );
}
