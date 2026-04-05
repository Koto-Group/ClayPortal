import Link from "next/link";
import type { ReactNode } from "react";
import type { TenantAuthContent } from "@/lib/types";

export function WorkspaceAuthShell({
  activeRoute,
  children,
  companyName,
  companySlug,
  content,
  segment,
  summary
}: {
  activeRoute: "login" | "register" | null;
  children: ReactNode;
  companyName: string;
  companySlug: string;
  content: TenantAuthContent;
  segment: string;
  summary: string;
}) {
  return (
    <main className="workspace-access-shell">
      <div className="workspace-access-grid">
        <section className="workspace-access-aside">
          <Link className="workspace-access-brand" href="/">
            ClayPortal
          </Link>

          <div className="workspace-access-copy">
            <span className="eyebrow">{content.eyebrow}</span>
            <h1>{companyName}</h1>
            <p>{summary}</p>
          </div>

          <div className="workspace-access-facts">
            <article className="workspace-fact-card">
              <span className="panel-label">Workspace</span>
              <strong>{segment}</strong>
            </article>
            <article className="workspace-fact-card">
              <span className="panel-label">Route</span>
              <strong>/{companySlug}</strong>
            </article>
          </div>

          <div className="workspace-access-highlights">
            {content.highlights.map((highlight) => (
              <article className="workspace-highlight-card" key={highlight}>
                <span className="workspace-highlight-dot" aria-hidden="true" />
                <p>{highlight}</p>
              </article>
            ))}
          </div>

          <nav className="workspace-access-nav" aria-label="Workspace access">
            <Link
              className={activeRoute === "login" ? "is-active" : ""}
              href={`/${companySlug}/login`}
            >
              Sign in
            </Link>
            <Link
              className={activeRoute === "register" ? "is-active" : ""}
              href={`/${companySlug}/register`}
            >
              Register
            </Link>
            <Link className={activeRoute === null ? "is-active" : ""} href={`/${companySlug}`}>
              Overview
            </Link>
          </nav>
        </section>

        <section className="workspace-access-panel">{children}</section>
      </div>
    </main>
  );
}
