import { getTenantCatalogEntry } from "@/lib/tenants/catalog";
import type { TenantDashboardSnapshot, TenantWorkspaceMetrics } from "@/lib/types";

const buildPrimaryStats = (metrics: TenantWorkspaceMetrics) => [
  {
    label: "Active members",
    value: `${metrics.activeMembers}`,
    detail: "Users currently cleared for this workspace",
    tone: "accent" as const
  },
  {
    label: "Pending invites",
    value: `${metrics.pendingInvites}`,
    detail: "Accounts staged but not yet activated",
    tone: metrics.pendingInvites > 0 ? ("warning" as const) : ("neutral" as const)
  },
  {
    label: "Access requests",
    value: `${metrics.openAccessRequests}`,
    detail: "New registration requests waiting for review",
    tone: metrics.openAccessRequests > 0 ? ("success" as const) : ("neutral" as const)
  },
  {
    label: "Admin handoffs",
    value: `${metrics.adminHandoffs}`,
    detail: "Recent assisted sessions across this tenant",
    tone: "neutral" as const
  }
];

export const buildTenantDashboardSnapshot = (input: {
  dashboardKey: string;
  companyName: string;
  viewerName: string;
  metrics: TenantWorkspaceMetrics;
}): TenantDashboardSnapshot => {
  const catalogEntry =
    getTenantCatalogEntry(input.dashboardKey) ??
    getTenantCatalogEntry("example-company");

  if (!catalogEntry) {
    throw new Error(`Unknown tenant dashboard "${input.dashboardKey}".`);
  }

  const primaryStats = buildPrimaryStats(input.metrics);

  switch (catalogEntry.key) {
    case "assembly-studio":
    case "example-company":
      return {
        eyebrow: "Delivery Command",
        headline: `${input.companyName} delivery workspace`,
        subheadline: `Project, approval, and finance visibility for ${input.viewerName}.`,
        status: "Invite-only client portal",
        summary:
          "Use this workspace to keep project stakeholders aligned without mixing internal tooling into the client-facing experience.",
        primaryStats,
        spotlightCards: [
          {
            eyebrow: "Projects",
            title: "Phase ownership stays explicit",
            body:
              "Each workstream keeps the current owner, pending decision, and next deliverable visible for both the client team and ClayPortal operators.",
            meta: "Geo-style queue discipline"
          },
          {
            eyebrow: "Approvals",
            title: "Decision gates get their own lane",
            body:
              "Review cycles are isolated from general project chatter so executive approvals do not get lost in delivery updates.",
            meta: "Stakeholder coordination"
          },
          {
            eyebrow: "Commercial",
            title: "Billing follows project movement",
            body:
              "Change orders, invoice checkpoints, and open finance tasks stay tied to the same client timeline as delivery work.",
            meta: "Revenue visibility"
          }
        ],
        workflowStages: [
          { name: "Kickoff", count: "03", detail: "New scopes moving into setup" },
          { name: "In review", count: "06", detail: "Packages waiting on client feedback" },
          { name: "Approved", count: "04", detail: "Ready for execution or closeout" },
          { name: "Billing", count: "02", detail: "Finance actions linked to active work" }
        ],
        activityFeed: [
          {
            title: "Weekly client summary generated",
            body: "AI recapped open deliverables, deadlines, and decision requests for the project lead.",
            timestamp: "18 minutes ago"
          },
          {
            title: "Design package moved to approval",
            body: "A stakeholder-ready review packet was staged with the latest notes and dependencies.",
            timestamp: "2 hours ago"
          },
          {
            title: "Finance checkpoint updated",
            body: "Commercial follow-up was attached to the current phase so delivery and billing stay in sync.",
            timestamp: "Today"
          }
        ],
        quickLinks: [
          {
            label: "Project review packets",
            description: "Deliver stakeholder-ready updates without rebuilding status notes."
          },
          {
            label: "Approval routing",
            description: "Separate blockers, approvers, and execution owners in one place."
          },
          {
            label: "Billing checkpoints",
            description: "Keep change orders and invoice timing connected to phase movement."
          }
        ]
      };
    case "northpeak-ops":
      return {
        eyebrow: "Operations Control",
        headline: `${input.companyName} operations dashboard`,
        subheadline: `Queue health, automation reviews, and escalations for ${input.viewerName}.`,
        status: "Live service workspace",
        summary:
          "This variant uses a denser command-center layout inspired by the Geo-Robotics reference and is tuned for throughput, blockers, and handoffs.",
        primaryStats,
        spotlightCards: [
          {
            eyebrow: "Queues",
            title: "Exceptions surface before they stall the line",
            body:
              "Escalations, aging work, and operator-owned exceptions get dedicated visibility so service teams can intervene quickly.",
            meta: "Queue management"
          },
          {
            eyebrow: "Automation",
            title: "AI reviews sit beside live work",
            body:
              "Agents can summarize tickets, draft responses, and flag anomalies while human reviewers stay inside the same workspace.",
            meta: "Human-in-the-loop"
          },
          {
            eyebrow: "Coverage",
            title: "Account health stays operational",
            body:
              "SLA risks, client-specific procedures, and open follow-ups remain visible to the team actually handling the workload.",
            meta: "Service execution"
          }
        ],
        workflowStages: [
          { name: "Inbound", count: "17", detail: "Fresh items entering triage" },
          { name: "Triage", count: "09", detail: "Being classified and routed" },
          { name: "Operator", count: "12", detail: "Assigned for human action" },
          { name: "Escalated", count: "03", detail: "Waiting on lead review" }
        ],
        activityFeed: [
          {
            title: "Escalation digest refreshed",
            body: "AI summarized the highest-risk tickets and suggested next actions for the service lead.",
            timestamp: "9 minutes ago"
          },
          {
            title: "Automation review loop completed",
            body: "A reviewer cleared the latest workflow outputs and pushed accepted actions into the queue.",
            timestamp: "47 minutes ago"
          },
          {
            title: "Service lane rebalanced",
            body: "Work was redistributed across operators after a spike in account-specific exceptions.",
            timestamp: "Today"
          }
        ],
        quickLinks: [
          {
            label: "Queue triage board",
            description: "Separate normal flow from aging or high-risk exceptions."
          },
          {
            label: "Automation audit lane",
            description: "Review AI output before it reaches the live service workflow."
          },
          {
            label: "Escalation coverage",
            description: "See which clients or queues need lead attention first."
          }
        ]
      };
    case "riverline-advisory":
      return {
        eyebrow: "Executive Workspace",
        headline: `${input.companyName} portfolio view`,
        subheadline: `Reporting, requests, and portfolio movement for ${input.viewerName}.`,
        status: "Executive reporting portal",
        summary:
          "This tenant prioritizes clarity over density, giving leadership and account stakeholders an easier read on progress, requests, and upcoming decisions.",
        primaryStats,
        spotlightCards: [
          {
            eyebrow: "Reporting",
            title: "Portfolio movement is presentation-ready",
            body:
              "AI-generated briefs and manually curated notes are combined into concise reporting blocks designed for leadership review.",
            meta: "Executive readability"
          },
          {
            eyebrow: "Requests",
            title: "Open asks stay attached to the outcome story",
            body:
              "Decision requests are shown next to the relevant account context so leaders can act without searching for background details.",
            meta: "Decision support"
          },
          {
            eyebrow: "Accounts",
            title: "Program health stays comparable",
            body:
              "Each account follows the same structure for visibility, making it easier to compare movement across a portfolio.",
            meta: "Cross-account reporting"
          }
        ],
        workflowStages: [
          { name: "Briefing", count: "05", detail: "Executive-ready summaries in progress" },
          { name: "Review", count: "04", detail: "Awaiting comments or sign-off" },
          { name: "Action", count: "07", detail: "Requests converted into next steps" },
          { name: "Closed", count: "11", detail: "Completed in the current reporting cycle" }
        ],
        activityFeed: [
          {
            title: "Leadership brief published",
            body: "Portfolio performance, risks, and next-step requests were rolled into a single summary.",
            timestamp: "27 minutes ago"
          },
          {
            title: "Account health review updated",
            body: "A new outcome narrative was added for one program with fresh status movement and client notes.",
            timestamp: "This morning"
          },
          {
            title: "New stakeholder request logged",
            body: "A reporting access request was captured for review in the admin console.",
            timestamp: "Today"
          }
        ],
        quickLinks: [
          {
            label: "Executive briefs",
            description: "Turn ongoing work into concise leadership reporting."
          },
          {
            label: "Portfolio requests",
            description: "Track high-importance asks without dropping context."
          },
          {
            label: "Account visibility",
            description: "Compare outcomes and risk across every active client program."
          }
        ]
      };
    default:
      return buildTenantDashboardSnapshot({
        ...input,
        dashboardKey: "example-company"
      });
  }
};
