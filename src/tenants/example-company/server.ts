import { getExampleDashboardSnapshot } from "@/lib/db/repositories";
import type { CompanyRecord, SessionUser } from "@/lib/types";

export const getDashboardSnapshot = ({
  company,
  session
}: {
  company: CompanyRecord;
  session: SessionUser;
}) => getExampleDashboardSnapshot(company, session);
