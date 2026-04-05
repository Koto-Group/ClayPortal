import Link from "next/link";
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
    <main className="workspace-dashboard-shell">
      <ImpersonationBanner session={session} />
      <div className="workspace-dashboard-layout">
        <aside className="workspace-dashboard-sidebar">
          <div className="workspace-sidebar-brand">
            <span className="eyebrow">Client Dashboard</span>
            <strong>{company.name}</strong>
            <p>{registryEntry.segment}</p>
          </div>

          <div className="workspace-sidebar-user">
            <span className="panel-label">Signed in as</span>
            <strong>{session.fullName || session.email}</strong>
            <p>{session.email}</p>
          </div>

          <nav className="workspace-sidebar-nav" aria-label="Tenant sections">
            {registryEntry.navigation.map((item) => (
              <article className="workspace-sidebar-nav-item" key={item.key}>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </nav>

          <div className="workspace-sidebar-note">
            <span className="panel-label">Client scope</span>
            <p>{registryEntry.summary}</p>
            <Link className="secondary-button" href={`/${company.slug}`}>
              Workspace overview
            </Link>
          </div>
        </aside>

        <section className="workspace-dashboard-main">
          <header className="workspace-dashboard-header">
            <div className="section-copy">
              <span className="eyebrow">{registryEntry.displayName}</span>
              <h1>{company.name}</h1>
              <p>{registryEntry.summary}</p>
            </div>

            <div className="workspace-dashboard-header-card">
              <span className="panel-label">Tenant route</span>
              <strong>/{company.slug}/dashboard</strong>
              <p>Dashboard logic stays isolated through the registered workspace key.</p>
            </div>
          </header>

          <DashboardComponent snapshot={snapshot} />
        </section>
      </div>
    </main>
  );
}
