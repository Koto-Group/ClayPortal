import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";
import { requireAdminPageSession } from "@/lib/auth/server";
import {
  getAdminMetrics,
  listAccessRequests,
  listCompaniesWithSummary,
  listUsersWithCompany
} from "@/lib/db/repositories";
import { listTenantTemplates } from "@/lib/tenants/registry";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminPageSession();
  const [metrics, companies, users, accessRequests] = await Promise.all([
    getAdminMetrics(),
    listCompaniesWithSummary(),
    listUsersWithCompany(),
    listAccessRequests()
  ]);

  return (
    <main className="dashboard-shell">
      <ImpersonationBanner session={session} />
      <AdminWorkspace
        accessRequests={accessRequests}
        companies={companies}
        dashboardTemplates={listTenantTemplates()}
        metrics={metrics}
        session={session}
        users={users}
      />
    </main>
  );
}
