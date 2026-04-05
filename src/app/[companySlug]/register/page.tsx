import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { WorkspaceAuthShell } from "@/components/auth/workspace-auth-shell";
import { findCompanyBySlug } from "@/lib/db/repositories";
import { getTenantRegistryEntry } from "@/lib/tenants/registry";

export const dynamic = "force-dynamic";

export default async function TenantRegisterPage({
  params
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const company = await findCompanyBySlug(companySlug);

  if (!company) {
    notFound();
  }

  const registryEntry = getTenantRegistryEntry(company.dashboard_key);
  if (!registryEntry) {
    notFound();
  }

  return (
    <WorkspaceAuthShell
      activeRoute="register"
      companyName={company.name}
      companySlug={company.slug}
      content={registryEntry.register}
      segment={registryEntry.segment}
      summary={registryEntry.summary}
    >
      <RegisterForm
        companyName={company.name}
        companySlug={company.slug}
        description={registryEntry.register.description}
        title={registryEntry.register.title}
      />
    </WorkspaceAuthShell>
  );
}
