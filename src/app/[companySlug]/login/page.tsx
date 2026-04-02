import { notFound } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { findCompanyBySlug } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export default async function TenantLoginPage({
  params
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const company = await findCompanyBySlug(companySlug);

  if (!company) {
    notFound();
  }

  return (
    <main className="auth-shell">
      <LoginForm
        companySlug={company.slug}
        description={`Enter the ${company.name} workspace. Tenant access stays scoped to ${company.slug}.`}
        title={`${company.name} sign in`}
        variant="tenant"
      />
    </main>
  );
}
