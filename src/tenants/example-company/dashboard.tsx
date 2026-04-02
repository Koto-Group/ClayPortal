import type { ExampleDashboardSnapshot } from "@/lib/types";

export default function ExampleCompanyDashboard({
  snapshot
}: {
  snapshot: ExampleDashboardSnapshot;
}) {
  return (
    <div className="tenant-dashboard">
      <section className="tenant-hero">
        <span className="eyebrow">Tenant Workspace</span>
        <h1>{snapshot.headline}</h1>
        <p>{snapshot.subheadline}</p>
      </section>
      <section className="tenant-grid">
        {snapshot.primaryStats.map((stat) => (
          <article className={`panel stat-card tone-${stat.tone}`} key={stat.label}>
            <span className="panel-label">{stat.label}</span>
            <strong className="stat-value">{stat.value}</strong>
          </article>
        ))}
      </section>
      <section className="tenant-grid">
        {snapshot.workstreams.map((stream) => (
          <article className="panel" key={stream.title}>
            <span className="panel-label">{stream.meta}</span>
            <h2>{stream.title}</h2>
            <p>{stream.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
