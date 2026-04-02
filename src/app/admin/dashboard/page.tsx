import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";
import { getAdminMetrics, listCompaniesWithSummary, listUsersWithCompany } from "@/lib/db/repositories";
import { requireAdminPageSession } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminPageSession();
  const [metrics, companies, users] = await Promise.all([
    getAdminMetrics(),
    listCompaniesWithSummary(),
    listUsersWithCompany()
  ]);

  return (
    <main className="dashboard-shell">
      <ImpersonationBanner session={session} />
      <AdminWorkspace companies={companies} metrics={metrics} session={session} users={users} />
    </main>
  );
}
