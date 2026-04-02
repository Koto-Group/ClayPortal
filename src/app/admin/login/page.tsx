import { LoginForm } from "@/components/auth/login-form";

export default function AdminLoginPage() {
  return (
    <main className="auth-shell">
      <LoginForm
        description="Platform-only access for provisioning tenants, sending invites, and impersonating company users."
        title="Admin sign in"
        variant="admin"
      />
    </main>
  );
}
