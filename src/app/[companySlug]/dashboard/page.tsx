import { notFound } from "next/navigation";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";
import { requireTenantPageSession } from "@/lib/auth/server";
import { findCompanyBySlug } from "@/lib/db/repositories";
import { getTenantRegistryEntry } from "@/lib/tenants/registry";

export const dynamic = "force-dynamic";

export default async function TenantDashboardPage({
  params
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const session = await requireTenantPageSession(companySlug);
  const company = await findCompanyBySlug(companySlug);

  if (!company) {
    notFound();
  }

  const registryEntry = getTenantRegistryEntry(company.dashboard_key);
  if (!registryEntry) {
    notFound();
  }

  const [{ default: DashboardComponent }, serverActions] = await Promise.all([
    registryEntry.loadDashboard(),
    registryEntry.loadServerActions()
  ]);

  const snapshot = await serverActions.getDashboardSnapshot({
    company,
    session
  });

  return (
    <main className="dashboard-shell">
      <ImpersonationBanner session={session} />
      <div className="dashboard-topbar">
        <div className="brand-lockup">
          <span className="eyebrow">Tenant Dashboard</span>
          <strong>{company.name}</strong>
          <p>{session.email}</p>
        </div>
        <nav className="dashboard-nav" aria-label="Tenant sections">
          {registryEntry.navigation.map((item) => (
            <span className="nav-chip" key={item.key} title={item.description}>
              {item.label}
            </span>
          ))}
        </nav>
      </div>
      <DashboardComponent snapshot={snapshot} />
    </main>
  );
}
