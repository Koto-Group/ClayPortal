import { getTenantWorkspaceMetrics } from "@/lib/db/repositories";
import { buildTenantDashboardSnapshot } from "@/lib/tenants/dashboard-content";
import type { CompanyRecord, SessionUser } from "@/lib/types";

export const getDashboardSnapshot = async ({
  company,
  session
}: {
  company: CompanyRecord;
  session: SessionUser;
}) => {
  const metrics = await getTenantWorkspaceMetrics(company, session);

  return buildTenantDashboardSnapshot({
    dashboardKey: company.dashboard_key,
    companyName: company.name,
    viewerName: session.fullName || session.email,
    metrics
  });
};
