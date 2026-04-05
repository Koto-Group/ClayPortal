import type { JSX } from "react";

export const USER_ROLES = [
  "platform_admin",
  "company_admin",
  "company_member"
] as const;

export const COMPANY_STATUSES = ["active", "draft", "disabled"] as const;
export const INVITE_STATUSES = ["pending", "active", "revoked"] as const;
export const ACCESS_REQUEST_STATUSES = [
  "new",
  "reviewing",
  "invited",
  "closed"
] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];
export type InviteStatus = (typeof INVITE_STATUSES)[number];
export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

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

export type AccessRequestRecord = {
  id: number;
  company_id: number;
  full_name: string;
  email: string;
  requested_role: Exclude<UserRole, "platform_admin">;
  team_name: string | null;
  use_case: string;
  notes: string | null;
  status: AccessRequestStatus;
  created_at: string;
  updated_at: string;
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

export type TenantMetricTone = "neutral" | "accent" | "warning" | "success";

export type TenantWorkspaceMetrics = {
  activeMembers: number;
  pendingInvites: number;
  adminHandoffs: number;
  openAccessRequests: number;
};

export type TenantDashboardSnapshot = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  status: string;
  summary: string;
  primaryStats: Array<{
    label: string;
    value: string;
    detail: string;
    tone: TenantMetricTone;
  }>;
  spotlightCards: Array<{
    eyebrow: string;
    title: string;
    body: string;
    meta: string;
  }>;
  workflowStages: Array<{
    name: string;
    count: string;
    detail: string;
  }>;
  activityFeed: Array<{
    title: string;
    body: string;
    timestamp: string;
  }>;
  quickLinks: Array<{
    label: string;
    description: string;
  }>;
};

export type TenantAuthContent = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
};

export type TenantLandingContent = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  highlights: string[];
};

export type TenantCatalogEntry = {
  key: string;
  displayName: string;
  demoSlug: string;
  summary: string;
  segment: string;
  navigation: TenantNavigationItem[];
  login: TenantAuthContent;
  register: TenantAuthContent;
  landing: TenantLandingContent;
};

export type TenantRegistryEntry = TenantCatalogEntry & {
  loadDashboard: () => Promise<{
    default: (props: { snapshot: TenantDashboardSnapshot }) => JSX.Element;
  }>;
  loadServerActions: () => Promise<{
    getDashboardSnapshot: (args: {
      company: CompanyRecord;
      session: SessionUser;
    }) => Promise<TenantDashboardSnapshot>;
  }>;
};

export type AdminMetrics = {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  invitedUsers: number;
  activeUsers: number;
  recentLogins: number;
  openAccessRequests: number;
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

export type AccessRequestSummary = AccessRequestRecord & {
  company_name: string;
  company_slug: string;
};
