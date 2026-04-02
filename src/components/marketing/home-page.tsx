import Link from "next/link";

export function MarketingHomePage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="section-copy">
            <span className="eyebrow">Custom SaaS + AI Delivery</span>
            <h1>ClayPortal turns each client into its own product surface.</h1>
            <p>
              Launch company-specific dashboards, operator workflows, invite-driven onboarding, and a platform admin layer from one Next.js codebase.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/admin/login">
                Admin login
              </Link>
              <Link className="secondary-button" href="/example-company/login">
                Example tenant
              </Link>
            </div>
          </div>
          <div className="hero-stack">
            <article className="panel callout-panel">
              <span className="panel-label">Tenant routing</span>
              <h2>`/:companySlug/dashboard`</h2>
              <p>Each company keeps its own workspace and its own module folder.</p>
            </article>
            <article className="panel callout-panel">
              <span className="panel-label">Platform control</span>
              <h2>Admin-owned provisioning</h2>
              <p>Create companies, send invites, and impersonate clients without mixing tenant code paths.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="feature-band">
        <article className="panel feature-panel">
          <span className="panel-label">Architecture</span>
          <h2>Shared shell, isolated tenant modules</h2>
          <p>
            Auth, layout, helpers, and deployment stay shared. Company-specific dashboards live in separate tenant folders keyed by `dashboard_key`.
          </p>
        </article>
        <article className="panel feature-panel">
          <span className="panel-label">Delivery</span>
          <h2>App Engine aligned</h2>
          <p>
            The app ships with `app.yaml`, `.appengineignore`, `cloudbuild.yaml`, and Knex migration flow modeled after the Geo-Robotics deployment setup.
          </p>
        </article>
      </section>
    </main>
  );
}
