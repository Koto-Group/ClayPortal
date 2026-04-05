import type { TenantDashboardSnapshot } from "@/lib/types";

export function ClientWorkspaceDashboard({
  snapshot
}: {
  snapshot: TenantDashboardSnapshot;
}) {
  return (
    <div className="tenant-workspace">
      <section className="tenant-workspace-hero panel">
        <div className="tenant-workspace-hero-copy">
          <span className="eyebrow">{snapshot.eyebrow}</span>
          <h1>{snapshot.headline}</h1>
          <p>{snapshot.subheadline}</p>
        </div>
        <div className="tenant-workspace-status">
          <span className="panel-label">Status</span>
          <strong>{snapshot.status}</strong>
          <p>{snapshot.summary}</p>
        </div>
      </section>

      <section className="tenant-stat-grid">
        {snapshot.primaryStats.map((stat) => (
          <article className={`panel tenant-stat-card tone-${stat.tone}`} key={stat.label}>
            <span className="panel-label">{stat.label}</span>
            <strong className="stat-value">{stat.value}</strong>
            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="tenant-content-grid">
        <div className="tenant-spotlight-grid">
          {snapshot.spotlightCards.map((card) => (
            <article className="panel tenant-spotlight-card" key={card.title}>
              <span className="panel-label">{card.eyebrow}</span>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
              <span className="tenant-card-meta">{card.meta}</span>
            </article>
          ))}
        </div>

        <article className="panel tenant-pipeline-card">
          <div className="panel-header">
            <div>
              <span className="panel-label">Workflow lanes</span>
              <h2>Current movement</h2>
            </div>
          </div>
          <div className="tenant-pipeline-list">
            {snapshot.workflowStages.map((stage) => (
              <div className="tenant-pipeline-row" key={stage.name}>
                <div>
                  <strong>{stage.name}</strong>
                  <p>{stage.detail}</p>
                </div>
                <span>{stage.count}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="tenant-content-grid tenant-content-grid-secondary">
        <article className="panel tenant-activity-card">
          <div className="panel-header">
            <div>
              <span className="panel-label">Activity</span>
              <h2>Latest updates</h2>
            </div>
          </div>
          <div className="tenant-activity-list">
            {snapshot.activityFeed.map((item) => (
              <article className="tenant-activity-item" key={`${item.title}-${item.timestamp}`}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
                <span>{item.timestamp}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="panel tenant-links-card">
          <div className="panel-header">
            <div>
              <span className="panel-label">Quick links</span>
              <h2>What this workspace supports</h2>
            </div>
          </div>
          <div className="tenant-links-list">
            {snapshot.quickLinks.map((link) => (
              <article className="tenant-link-item" key={link.label}>
                <strong>{link.label}</strong>
                <p>{link.description}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
