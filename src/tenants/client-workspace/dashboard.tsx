import { ClientWorkspaceDashboard } from "@/components/tenant/client-workspace-dashboard";
import type { TenantDashboardSnapshot } from "@/lib/types";

export default function TenantDashboard({
  snapshot
}: {
  snapshot: TenantDashboardSnapshot;
}) {
  return <ClientWorkspaceDashboard snapshot={snapshot} />;
}
