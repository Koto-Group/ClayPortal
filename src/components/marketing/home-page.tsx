import Link from "next/link";
import { listTenantCatalogEntries } from "@/lib/tenants/catalog";

const proofLogos = ["Koto Group", "Northpeak", "Riverline", "Slate Labs", "Atlas Ops"];

const modules = [
  {
    title: "Company portals",
    subtitle: "Client-facing software",
    metric: "Requests live",
    value: "24",
    items: ["Onboarding", "Files", "Billing"],
  },
  {
    title: "Internal systems",
    subtitle: "Operations and workflows",
    metric: "Ops queues",
    value: "08",
    items: ["Approvals", "Routing", "Review"],
  },
  {
    title: "AI automation",
    subtitle: "Agents and review loops",
    metric: "AI actions",
    value: "42",
    items: ["Summaries", "Triage", "Follow-up"],
  },
];

const pills = ["Custom builds", "AI workflows", "Shared platform", "Admin layer"];

const platformNav = ["Overview", "Companies", "Users", "Workflows"];

const platformStats = [
  { label: "Companies", value: "24" },
  { label: "Active", value: "18" },
  { label: "Automations", value: "42" },
];

const platformRows = [
  { company: "Acme", status: "Live", type: "Portal" },
  { company: "Brightpath", status: "Build", type: "Ops" },
  { company: "Northstar", status: "Review", type: "AI" },
];

const workspaceShowcase = listTenantCatalogEntries().filter(
  (entry) => entry.key !== "example-company"
);

export function MarketingHomePage() {
  return (
    <main className="marketing-page-v3">
      <div className="marketing-topbar-v3">
        <a href="#platform">
          We build custom AI solutions for companies
          <span className="marketing-topbar-arrow">→</span>
        </a>
      </div>

      <div className="page-shell landing-shell-v3">
        <header className="marketing-navbar-v3">
          <Link className="marketing-logo-v3" href="/">
            ClayPortal
          </Link>

          <nav className="marketing-main-nav-v3" aria-label="Primary">
            <a href="#showcase">Solutions</a>
            <a href="#platform">Platform</a>
            <a href="#footer">Resources</a>
          </nav>

          <div className="marketing-nav-actions-v3">
            <Link className="nav-link-button-v3" href="/example-company/login">
              Demo
            </Link>
            <Link className="nav-link-button-v3" href="/admin/login">
              Log in
            </Link>
            <Link className="primary-button" href="/admin/login">
              Get started
            </Link>
          </div>
        </header>

        <section className="hero-v3" id="showcase">
          <div className="hero-copy-v3">
            <span className="hero-kicker-v3">Custom AI solutions for companies</span>
            <h1>Software built around the business.</h1>
            <p>Portals, internal systems, and AI workflows designed for each company.</p>
            <div className="hero-actions">
              <Link className="primary-button" href="/admin/login">
                Open admin
              </Link>
              <Link className="secondary-button" href="/example-company/login">
                View demo
              </Link>
            </div>
          </div>

          <div className="hero-browser-v3 panel">
            <div className="browser-top-v3" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="browser-layout-v3">
              <aside className="browser-sidebar-v3">
                <strong>Demo Company</strong>
                <span>Overview</span>
                <span>Workflows</span>
                <span>Knowledge</span>
                <span>Activity</span>
                <span>Settings</span>
              </aside>

              <div className="browser-main-v3">
                <div className="browser-row-v3">
                  <article className="browser-card-v3 browser-card-v3-primary">
                    <span className="panel-label">Solution</span>
                    <h2>AI operations</h2>
                    <div className="browser-lines-v3">
                      <span className="wide" />
                      <span className="medium" />
                      <span className="short" />
                    </div>
                  </article>

                  <article className="browser-card-v3">
                    <span className="panel-label">Status</span>
                    <strong>Live</strong>
                    <div className="mini-stack-v3">
                      <span />
                      <span />
                      <span />
                    </div>
                  </article>
                </div>

                <div className="browser-data-v3">
                  <div className="data-header-v3">
                    <span>Company</span>
                    <span>Status</span>
                    <span>Type</span>
                  </div>
                  <div className="data-row-v3">
                    <span>Acme</span>
                    <span className="badge-v3">Active</span>
                    <span>Portal</span>
                  </div>
                  <div className="data-row-v3">
                    <span>Brightpath</span>
                    <span className="badge-v3">Build</span>
                    <span>Ops</span>
                  </div>
                  <div className="data-row-v3">
                    <span>Northstar</span>
                    <span className="badge-v3">Live</span>
                    <span>AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="proof-row-v3" aria-label="Teams">
          {proofLogos.map((logo) => (
            <span key={logo} className="proof-chip-v3">
              {logo}
            </span>
          ))}
        </section>

        <section className="module-grid-v3">
          {modules.map((module) => (
            <article key={module.title} className="module-card-v3">
              <div className="module-ui-v3">
                <div className="module-ui-bar-v3">
                  <span className="module-ui-label-v3">{module.metric}</span>
                  <strong>{module.value}</strong>
                </div>
                <div className="module-ui-row-v3 module-ui-row-v3-text">
                  {module.items.slice(0, 2).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="module-ui-list-v3 module-ui-list-v3-text">
                  {module.items.map((item) => (
                    <div key={item} className="module-list-item-v3">
                      <span className="module-list-dot-v3" />
                      <small>{item}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="module-copy-v3">
                <strong>{module.title}</strong>
                <span>{module.subtitle}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="workspace-showcase-v3">
          <div className="section-heading">
            <span className="eyebrow">Client workspaces</span>
            <h2>Separated dashboards designed per client.</h2>
            <p>Each tenant gets its own login, registration path, navigation, and dashboard voice.</p>
          </div>

          <div className="workspace-showcase-grid-v3">
            {workspaceShowcase.map((workspace) => (
              <article className="workspace-showcase-card-v3" key={workspace.key}>
                <div className="workspace-showcase-top-v3">
                  <span className="panel-label">{workspace.segment}</span>
                  <strong>{workspace.displayName}</strong>
                  <p>{workspace.summary}</p>
                </div>

                <div className="workspace-showcase-stats-v3">
                  {workspace.landing.stats.map((stat) => (
                    <div key={stat.label}>
                      <span>{stat.label}</span>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="workspace-showcase-actions-v3">
                  <Link className="secondary-button" href={`/${workspace.demoSlug}`}>
                    Overview
                  </Link>
                  <Link className="primary-button" href={`/${workspace.demoSlug}/login`}>
                    Open workspace
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="contrast-band-v3" id="platform">
        <div className="page-shell contrast-shell-v3">
          <div className="contrast-tabs-v3" aria-label="Platform modes">
            <button className="is-active" type="button">
              Build
            </button>
            <button type="button">Operate</button>
            <button type="button">Scale</button>
          </div>

          <div className="contrast-content-v3">
            <div className="contrast-copy-v3">
              <h1>Custom AI. Built for the company.</h1>
              <p>One foundation. Tailored solutions.</p>
              <Link className="contrast-button-v3" href="/example-company/login">
                View demo
              </Link>
            </div>

            <div className="contrast-visuals-v3">
              <article className="contrast-panel-v3">
                <span className="panel-label">Platform</span>
                <div className="contrast-panel-grid-v3">
                  <div className="dark-card-v3 large">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="dark-card-v3">
                    <span />
                    <span />
                  </div>
                  <div className="dark-card-v3">
                    <span />
                    <span />
                  </div>
                </div>
              </article>

              <div className="contrast-stack-v3">
                <article className="contrast-mini-card-v3">
                  <span className="panel-label">Admin</span>
                  <strong>Create</strong>
                  <strong>Support</strong>
                  <strong>Track</strong>
                </article>

                <article className="contrast-mini-card-v3 contrast-mini-card-v3-soft">
                  {pills.map((pill) => (
                    <span key={pill}>{pill}</span>
                  ))}
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell landing-shell-v3">
        <section className="platform-grid-v3">
          <article className="platform-screen-v3">
            <div className="platform-screen-top-v3">
              <span />
              <span />
              <span />
            </div>
            <div className="platform-screen-body-v3">
              <div className="platform-screen-sidebar-v3">
                {platformNav.map((item) => (
                  <div key={item} className="platform-nav-item-v3">
                    {item}
                  </div>
                ))}
              </div>
              <div className="platform-screen-main-v3">
                <div className="platform-screen-stats-v3">
                  {platformStats.map((stat) => (
                    <article key={stat.label} className="platform-stat-v3">
                      <span className="panel-label">{stat.label}</span>
                      <strong>{stat.value}</strong>
                    </article>
                  ))}
                </div>
                <div className="platform-screen-table-v3">
                  <div className="platform-table-header-v3">
                    <span>Company</span>
                    <span>Status</span>
                    <span>Type</span>
                  </div>
                  {platformRows.map((row) => (
                    <div key={row.company} className="platform-table-row-v3">
                      <span>{row.company}</span>
                      <span className="badge-v3">{row.status}</span>
                      <span>{row.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <div className="platform-copy-v3">
            <span className="eyebrow">Shared platform</span>
            <h2>Built for custom AI solutions.</h2>
            <p>Admin, routing, workflows, and company-specific product logic in one stack.</p>
            <div className="platform-pill-card-v3">
              {pills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-cta-v3">
          <div className="section-heading">
            <span className="eyebrow">Start here</span>
            <h2>One base for custom company software.</h2>
          </div>
          <div className="hero-actions">
            <Link className="primary-button" href="/admin/login">
              Open admin
            </Link>
            <Link className="secondary-button" href="/example-company/login">
              Open demo
            </Link>
          </div>
        </section>

        <footer className="marketing-footer-v3" id="footer">
          <strong>ClayPortal</strong>
          <div className="marketing-footer-links-v3">
            <span>Client portals</span>
            <span>Internal tools</span>
            <span>AI workflows</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
