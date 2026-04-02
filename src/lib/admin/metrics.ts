import type { AdminMetrics } from "@/lib/types";

export const metricsCards = (metrics: AdminMetrics) => [
  {
    label: "Companies",
    value: `${metrics.totalCompanies}`,
    detail: `${metrics.activeCompanies} active`
  },
  {
    label: "Users",
    value: `${metrics.totalUsers}`,
    detail: `${metrics.activeUsers} active`
  },
  {
    label: "Invites",
    value: `${metrics.invitedUsers}`,
    detail: `${metrics.recentLogins} recent logins this week`
  }
];
