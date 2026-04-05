import Link from "next/link";
import { notFound } from "next/navigation";
import { findCompanyBySlug } from "@/lib/db/repositories";
import { getTenantRegistryEntry } from "@/lib/tenants/registry";

export default async function CompanyIndexPage({
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
    <main className="workspace-overview-shell">
      <div className="workspace-overview-grid">
        <section className="panel workspace-overview-hero">
          <div className="section-copy">
            <span className="eyebrow">{registryEntry.landing.eyebrow}</span>
            <h1>{registryEntry.landing.title}</h1>
            <p>{registryEntry.landing.description}</p>
          </div>

          <div className="workspace-overview-actions">
            <Link className="primary-button" href={`/${company.slug}/login`}>
              Sign in
            </Link>
            <Link className="secondary-button" href={`/${company.slug}/register`}>
              Register
            </Link>
          </div>
        </section>

        <section className="workspace-overview-stat-grid">
          {registryEntry.landing.stats.map((stat) => (
            <article className="panel workspace-overview-stat" key={stat.label}>
              <span className="panel-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="panel workspace-overview-highlights">
          <div className="panel-header">
            <div>
              <span className="panel-label">Highlights</span>
              <h2>{company.name} workspace context</h2>
            </div>
          </div>
          <div className="workspace-overview-list">
            {registryEntry.landing.highlights.map((highlight) => (
              <article className="workspace-overview-item" key={highlight}>
                <span className="workspace-highlight-dot" aria-hidden="true" />
                <p>{highlight}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel workspace-overview-highlights">
          <div className="panel-header">
            <div>
              <span className="panel-label">Navigation</span>
              <h2>Separated client sections</h2>
            </div>
          </div>
          <div className="workspace-overview-list">
            {registryEntry.navigation.map((item) => (
              <article className="workspace-overview-item" key={item.key}>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
