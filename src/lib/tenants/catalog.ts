import type { TenantCatalogEntry } from "@/lib/types";

const exampleCompanyNavigation = [
  {
    key: "overview",
    label: "Overview",
    description: "Delivery health and stakeholder visibility"
  },
  {
    key: "projects",
    label: "Projects",
    description: "Milestones, approvals, and active scopes"
  },
  {
    key: "approvals",
    label: "Approvals",
    description: "Reviews, decision points, and blocked items"
  },
  {
    key: "billing",
    label: "Billing",
    description: "Commercial status and open follow-ups"
  }
] satisfies TenantCatalogEntry["navigation"];

export const tenantCatalog: Record<string, TenantCatalogEntry> = {
  "example-company": {
    key: "example-company",
    displayName: "Example Company",
    demoSlug: "example-company",
    summary:
      "Demo client workspace for onboarding, approvals, and AI-assisted delivery loops.",
    segment: "Client delivery workspace",
    navigation: exampleCompanyNavigation,
    login: {
      eyebrow: "Client Workspace",
      title: "Sign in to the Example Company portal",
      description:
        "Review deliverables, answer approvals, and stay aligned with the active engagement team.",
      highlights: [
        "Project milestones and deadlines stay visible in one place",
        "AI-generated recaps reduce back-and-forth for each decision cycle",
        "Billing, onboarding, and delivery updates remain scoped to this client"
      ]
    },
    register: {
      eyebrow: "Request Access",
      title: "Ask for workspace access",
      description:
        "Submit a structured request for a project lead, executive stakeholder, or finance contact.",
      highlights: [
        "Registration creates an onboarding request instead of a live account",
        "Access requests are reviewed in the platform admin console",
        "Approved requests are converted into tenant invites by the ClayPortal team"
      ]
    },
    landing: {
      eyebrow: "Reference Workspace",
      title: "A client dashboard patterned after an operations platform shell",
      description:
        "This tenant uses a denser command-center layout inspired by the Geo-Robotics reference while staying aligned with the current multi-tenant app.",
      stats: [
        { label: "Projects", value: "08" },
        { label: "Approvals", value: "17" },
        { label: "AI recaps", value: "31" }
      ],
      highlights: [
        "Separate client route with tenant-scoped auth",
        "Invite-only login for approved workspace members",
        "Access-request registration flow for new stakeholders"
      ]
    }
  },
  "assembly-studio": {
    key: "assembly-studio",
    displayName: "Assembly Studio",
    demoSlug: "assembly",
    summary:
      "Client delivery dashboard for design reviews, approvals, and milestone management.",
    segment: "Design delivery workspace",
    navigation: [
      {
        key: "overview",
        label: "Overview",
        description: "Delivery status, deadlines, and risk flags"
      },
      {
        key: "projects",
        label: "Projects",
        description: "Active scopes, phase owners, and project health"
      },
      {
        key: "approvals",
        label: "Approvals",
        description: "Pending sign-offs and decision bottlenecks"
      },
      {
        key: "billing",
        label: "Billing",
        description: "Change orders, invoices, and finance follow-ups"
      }
    ],
    login: {
      eyebrow: "Assembly Access",
      title: "Enter the Assembly Studio dashboard",
      description:
        "Track projects, review design packages, and keep stakeholders aligned from kickoff through closeout.",
      highlights: [
        "Delivery milestones stay grouped by project phase",
        "Approval queues separate executive reviews from operator tasks",
        "Weekly summaries are packaged for clients and internal leads"
      ]
    },
    register: {
      eyebrow: "Assembly Onboarding",
      title: "Request stakeholder access",
      description:
        "Register a new contact for project delivery, finance review, or executive reporting.",
      highlights: [
        "Requests are triaged before credentials are issued",
        "One workspace supports project, billing, and reporting coordination",
        "Ideal for agency and design-build client teams"
      ]
    },
    landing: {
      eyebrow: "Assembly Template",
      title: "Delivery coordination for high-touch client work",
      description:
        "Built for firms that manage phased work, frequent stakeholder approvals, and recurring client updates.",
      stats: [
        { label: "Live phases", value: "12" },
        { label: "Decision gates", value: "09" },
        { label: "Weekly recaps", value: "22" }
      ],
      highlights: [
        "Strong emphasis on approvals and milestone visibility",
        "Commercial and delivery views share one tenant workspace",
        "Best fit for agencies, design teams, and consultancies"
      ]
    }
  },
  "northpeak-ops": {
    key: "northpeak-ops",
    displayName: "Northpeak Ops",
    demoSlug: "northpeak",
    summary:
      "Operational dashboard for support queues, automation health, and service execution.",
    segment: "Operations workspace",
    navigation: [
      {
        key: "overview",
        label: "Overview",
        description: "Live queue health and delivery performance"
      },
      {
        key: "operations",
        label: "Operations",
        description: "Tickets, escalations, and throughput"
      },
      {
        key: "automation",
        label: "Automation",
        description: "AI workflows and review loops"
      },
      {
        key: "service",
        label: "Service",
        description: "Account coverage, SLAs, and resolution trends"
      }
    ],
    login: {
      eyebrow: "Ops Access",
      title: "Sign in to Northpeak Ops",
      description:
        "Monitor queues, inspect exceptions, and manage AI-supported service operations in one command center.",
      highlights: [
        "Queue-level visibility mirrors a dense operations control room",
        "Automation review loops sit next to the live service workload",
        "Client access remains fully isolated by tenant route"
      ]
    },
    register: {
      eyebrow: "Ops Onboarding",
      title: "Request workspace onboarding",
      description:
        "Register operators, support leads, or client-side reviewers who need tenant access.",
      highlights: [
        "Useful for logistics, support, and managed-service clients",
        "Requests are staged before live invite issuance",
        "Access scopes remain tied to the selected client dashboard"
      ]
    },
    landing: {
      eyebrow: "Northpeak Template",
      title: "A Geo-Robotics-style shell for operational client teams",
      description:
        "This variant leans into queue density, multi-lane workflow visibility, and execution tracking.",
      stats: [
        { label: "Queues", value: "14" },
        { label: "Automations", value: "11" },
        { label: "Escalations", value: "04" }
      ],
      highlights: [
        "Best fit for support, logistics, and operational service teams",
        "Dashboard prioritizes throughput, blockers, and handoffs",
        "Pairs well with AI agents that summarize and route exceptions"
      ]
    }
  },
  "riverline-advisory": {
    key: "riverline-advisory",
    displayName: "Riverline Advisory",
    demoSlug: "riverline",
    summary:
      "Executive portal for portfolio reporting, requests, and account visibility.",
    segment: "Executive reporting workspace",
    navigation: [
      {
        key: "overview",
        label: "Overview",
        description: "Portfolio health and high-level movement"
      },
      {
        key: "portfolio",
        label: "Portfolio",
        description: "Accounts, programs, and tracked outcomes"
      },
      {
        key: "reporting",
        label: "Reporting",
        description: "Executive briefs and weekly rollups"
      },
      {
        key: "requests",
        label: "Requests",
        description: "Open asks, approvals, and next steps"
      }
    ],
    login: {
      eyebrow: "Executive Access",
      title: "Open the Riverline Advisory portal",
      description:
        "See account health, portfolio movement, and executive-ready reporting without entering the operations layer.",
      highlights: [
        "Presentation-ready views for leadership and account stakeholders",
        "Requests and approvals stay connected to reporting context",
        "A calmer dashboard mode for lower-frequency but higher-importance review"
      ]
    },
    register: {
      eyebrow: "Executive Onboarding",
      title: "Request reporting access",
      description:
        "Submit a request for account leads, executives, or finance stakeholders who need a tenant portal.",
      highlights: [
        "Designed for reporting-heavy client relationships",
        "Requests can be approved and invited from the admin console",
        "Tenant-specific language keeps prompts and UI aligned with the client"
      ]
    },
    landing: {
      eyebrow: "Riverline Template",
      title: "A client portal geared toward portfolio visibility",
      description:
        "Built for account-heavy businesses that need concise reporting, requests, and executive review cycles.",
      stats: [
        { label: "Portfolios", value: "06" },
        { label: "Briefings", value: "18" },
        { label: "Requests", value: "07" }
      ],
      highlights: [
        "Emphasizes clarity, status movement, and leadership reporting",
        "Useful for advisory, finance, and account-managed services",
        "Still uses the same tenant auth and admin platform underneath"
      ]
    }
  }
};

export const getTenantCatalogEntry = (key: string) => tenantCatalog[key] ?? null;

export const listTenantCatalogEntries = () => Object.values(tenantCatalog);
