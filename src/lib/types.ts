import type { JSX } from "react";

export const USER_ROLES = [
  "platform_admin",
  "company_admin",
  "company_member"
] as const;

export const COMPANY_STATUSES = ["active", "draft", "disabled"] as const;
export const INVITE_STATUSES = ["pending", "active", "revoked"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];
export type InviteStatus = (typeof INVITE_STATUSES)[number];

export type CompanyRecord = {
  id: number;
  name: string;
  slug: string;
  dashboard_key: string;
  status: CompanyStatus;
  branding_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type UserRecord = {
  id: number;
  email: string;
  full_name: string | null;
  firebase_uid: string | null;
  role: UserRole;
  company_id: number | null;
  invite_status: InviteStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserInviteRecord = {
  id: number;
  company_id: number;
  email: string;
  role: Exclude<UserRole, "platform_admin">;
  token_hash: string;
  expires_at: string;
  accepted_at: string | null;
  invited_by_user_id: number;
  created_at: string;
  updated_at: string;
};

export type ImpersonationAuditRecord = {
  id: number;
  admin_user_id: number;
  target_user_id: number;
  company_id: number | null;
  started_at: string;
  ended_at: string | null;
};

export type SessionUser = {
  userId: number;
  email: string;
  fullName: string | null;
  role: UserRole;
  companyId: number | null;
  companySlug: string | null;
  companyName: string | null;
  impersonation?: {
    auditId: number;
    originalAdminUserId: number;
    originalAdminEmail: string;
    originalAdminName: string | null;
    originalAdminRole: UserRole;
    originalCompanyId: number | null;
    originalCompanySlug: string | null;
    originalCompanyName: string | null;
  };
};

export type TenantNavigationItem = {
  key: string;
  label: string;
  description: string;
};

export type ExampleDashboardSnapshot = {
  headline: string;
  subheadline: string;
  primaryStats: Array<{
    label: string;
    value: string;
    tone: "neutral" | "accent" | "warning";
  }>;
  workstreams: Array<{
    title: string;
    body: string;
    meta: string;
  }>;
};

export type TenantRegistryEntry = {
  key: string;
  displayName: string;
  navigation: TenantNavigationItem[];
  loadDashboard: () => Promise<{
    default: (props: { snapshot: ExampleDashboardSnapshot }) => JSX.Element;
  }>;
  loadServerActions: () => Promise<{
    getDashboardSnapshot: (args: {
      company: CompanyRecord;
      session: SessionUser;
    }) => Promise<ExampleDashboardSnapshot>;
  }>;
};

export type AdminMetrics = {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  invitedUsers: number;
  activeUsers: number;
  recentLogins: number;
  usersPerCompany: Array<{
    companyId: number;
    companyName: string;
    userCount: number;
  }>;
};

export type CompanySummary = CompanyRecord & {
  user_count: number;
  invited_user_count: number;
};

export type UserSummary = UserRecord & {
  company_name: string | null;
};
