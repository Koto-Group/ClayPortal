import type { Knex } from "knex";
import { getDb } from "@/lib/db/connection";
import { hashInviteToken } from "@/lib/security/invite-tokens";
import type {
  AdminMetrics,
  CompanyRecord,
  CompanyStatus,
  CompanySummary,
  ExampleDashboardSnapshot,
  SessionUser,
  UserInviteRecord,
  UserRole,
  UserSummary
} from "@/lib/types";

const baseCompanyColumns = [
  "id",
  "name",
  "slug",
  "dashboard_key",
  "status",
  "branding_json",
  "created_at",
  "updated_at"
];

const baseUserColumns = [
  "id",
  "email",
  "full_name",
  "firebase_uid",
  "role",
  "company_id",
  "invite_status",
  "last_login_at",
  "created_at",
  "updated_at"
];

export const withDb = async <T>(callback: (db: Knex) => Promise<T>) =>
  callback(await getDb());

export const findCompanyBySlug = async (
  slug: string
): Promise<CompanyRecord | null> =>
  withDb(async (db) => {
    const row = await db("companies")
      .select(baseCompanyColumns)
      .where({ slug })
      .first();
    return (row as CompanyRecord | undefined) ?? null;
  });

export const findCompanyById = async (
  id: number
): Promise<CompanyRecord | null> =>
  withDb(async (db) => {
    const row = await db("companies")
      .select(baseCompanyColumns)
      .where({ id })
      .first();
    return (row as CompanyRecord | undefined) ?? null;
  });

export const listCompaniesWithSummary = async () =>
  withDb(async (db) => {
    const rows = await db("companies as c")
      .leftJoin("users as u", "u.company_id", "c.id")
      .select(
        "c.id",
        "c.name",
        "c.slug",
        "c.dashboard_key",
        "c.status",
        "c.branding_json",
        "c.created_at",
        "c.updated_at"
      )
      .count<{ user_count: string }>("u.id as user_count")
      .sum<{ invited_user_count: string }>(
        db.raw("case when u.invite_status = 'pending' then 1 else 0 end as invited_user_count")
      )
      .groupBy("c.id")
      .orderBy("c.created_at", "desc");

    const typedRows = rows as unknown as Array<
      CompanyRecord & {
        user_count: string | number;
        invited_user_count: string | number;
      }
    >;

    return typedRows.map(
      (row) =>
        ({
          ...row,
          user_count: Number(row.user_count || 0),
          invited_user_count: Number(row.invited_user_count || 0)
        }) as CompanySummary
    );
  });

export const createCompany = async (input: {
  name: string;
  slug: string;
  dashboardKey: string;
  status: CompanyStatus;
  brandingJson?: Record<string, unknown> | null;
}) =>
  withDb(async (db) => {
    const [row] = await db<CompanyRecord>("companies")
      .insert({
        name: input.name,
        slug: input.slug,
        dashboard_key: input.dashboardKey,
        status: input.status,
        branding_json: input.brandingJson ?? null
      })
      .returning(baseCompanyColumns);
    return row;
  });

export const updateCompany = async (
  id: number,
  input: {
    name: string;
    slug: string;
    dashboardKey: string;
    status: CompanyStatus;
    brandingJson?: Record<string, unknown> | null;
  }
) =>
  withDb(async (db) => {
    const [row] = await db<CompanyRecord>("companies")
      .where({ id })
      .update({
        name: input.name,
        slug: input.slug,
        dashboard_key: input.dashboardKey,
        status: input.status,
        branding_json: input.brandingJson ?? null,
        updated_at: db.fn.now()
      })
      .returning(baseCompanyColumns);
    return row ?? null;
  });

export const listUsersWithCompany = async () =>
  withDb(async (db) =>
    db("users as u")
      .leftJoin("companies as c", "c.id", "u.company_id")
      .select(
        "u.id",
        "u.email",
        "u.full_name",
        "u.firebase_uid",
        "u.role",
        "u.company_id",
        "u.invite_status",
        "u.last_login_at",
        "u.created_at",
        "u.updated_at",
        "c.name as company_name"
      )
      .orderBy("u.created_at", "desc") as Promise<UserSummary[]>
  );

export const findUserByEmail = async (email: string) =>
  withDb(async (db) =>
    (await db("users").select(baseUserColumns).whereRaw("lower(email) = ?", [email.toLowerCase()]).first()) ??
    null
  );

export const findUserById = async (id: number) =>
  withDb(async (db) =>
    (await db("users").select(baseUserColumns).where({ id }).first()) ?? null
  );

export const findUserByFirebaseUid = async (firebaseUid: string) =>
  withDb(async (db) =>
    (await db("users").select(baseUserColumns).where({ firebase_uid: firebaseUid }).first()) ?? null
  );

export const recordSuccessfulLogin = async (userId: number) =>
  withDb(async (db) =>
    db("users").where({ id: userId }).update({
      invite_status: "active",
      last_login_at: db.fn.now(),
      updated_at: db.fn.now()
    })
  );

export const createOrUpdateInvitedUser = async (input: {
  email: string;
  fullName: string | null;
  role: Exclude<UserRole, "platform_admin">;
  companyId: number;
}) =>
  withDb(async (db) => {
    const existing = await db("users")
      .select(baseUserColumns)
      .whereRaw("lower(email) = ?", [input.email.toLowerCase()])
      .first();

    if (existing) {
      if (existing.role === "platform_admin") {
        throw new Error("Platform admins cannot be reassigned to a tenant invite.");
      }

      if (
        existing.company_id &&
        existing.company_id !== input.companyId &&
        existing.invite_status === "active"
      ) {
        throw new Error(
          "This email already belongs to an active user in another company."
        );
      }

      const [updated] = await db("users")
        .where({ id: existing.id })
        .update({
          full_name: input.fullName,
          role: input.role,
          company_id: input.companyId,
          invite_status: "pending",
          updated_at: db.fn.now()
        })
        .returning(baseUserColumns);
      return updated;
    }

    const [created] = await db("users")
      .insert({
        email: input.email.toLowerCase(),
        full_name: input.fullName,
        role: input.role,
        company_id: input.companyId,
        invite_status: "pending"
      })
      .returning(baseUserColumns);
    return created;
  });

export const createOrRefreshInvite = async (input: {
  companyId: number;
  email: string;
  role: Exclude<UserRole, "platform_admin">;
  invitedByUserId: number;
  token: string;
  expiresAt: string;
}) =>
  withDb(async (db) => {
    const tokenHash = hashInviteToken(input.token);
    const existing = await db<UserInviteRecord>("user_invites")
      .where({
        company_id: input.companyId,
        email: input.email.toLowerCase()
      })
      .whereNull("accepted_at")
      .orderBy("created_at", "desc")
      .first();

    if (existing) {
      const [updated] = await db<UserInviteRecord>("user_invites")
        .where({ id: existing.id })
        .update({
          token_hash: tokenHash,
          expires_at: input.expiresAt,
          invited_by_user_id: input.invitedByUserId,
          updated_at: db.fn.now()
        })
        .returning("*");
      return updated;
    }

    const [created] = await db<UserInviteRecord>("user_invites")
      .insert({
        company_id: input.companyId,
        email: input.email.toLowerCase(),
        role: input.role,
        token_hash: tokenHash,
        expires_at: input.expiresAt,
        invited_by_user_id: input.invitedByUserId
      })
      .returning("*");
    return created;
  });

export const findInviteByToken = async (token: string) =>
  withDb(async (db) =>
    db("user_invites as i")
      .join("companies as c", "c.id", "i.company_id")
      .select(
        "i.*",
        "c.name as company_name",
        "c.slug as company_slug",
        "c.dashboard_key as company_dashboard_key",
        "c.status as company_status"
      )
      .where("i.token_hash", hashInviteToken(token))
      .first()
  );

export const acceptInvite = async (input: {
  inviteId: number;
  companyId: number;
  email: string;
  fullName: string | null;
  firebaseUid: string;
}) =>
  withDb(async (db) => {
    const [user] = await db("users")
      .whereRaw("lower(email) = ?", [input.email.toLowerCase()])
      .update({
        full_name: input.fullName,
        firebase_uid: input.firebaseUid,
        company_id: input.companyId,
        invite_status: "active",
        last_login_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning(baseUserColumns);

    await db("user_invites").where({ id: input.inviteId }).update({
      accepted_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    return user;
  });

export const getAdminMetrics = async (): Promise<AdminMetrics> =>
  withDb(async (db) => {
    const [rawCompanyTotals, rawUserTotals, rawRecentLogins, rawUsersPerCompany] =
      await Promise.all([
      db("companies")
        .count<{ count: string }>("id as count")
        .sum<{ active_count: string }>(
          db.raw("case when status = 'active' then 1 else 0 end as active_count")
        )
        .first(),
      db("users")
        .count<{ count: string }>("id as count")
        .sum<{ invited_count: string }>(
          db.raw("case when invite_status = 'pending' then 1 else 0 end as invited_count")
        )
        .sum<{ active_count: string }>(
          db.raw("case when invite_status = 'active' then 1 else 0 end as active_count")
        )
        .first(),
      db("users")
        .count<{ count: string }>("id as count")
        .whereRaw("last_login_at >= now() - interval '7 days'")
        .first(),
      db("companies as c")
        .leftJoin("users as u", "u.company_id", "c.id")
        .select("c.id as companyId", "c.name as companyName")
        .count<{ userCount: string }>("u.id as userCount")
        .groupBy("c.id")
        .orderBy("c.name", "asc")
      ]);

    const companyTotals = rawCompanyTotals as unknown as
      | { count?: string | number; active_count?: string | number }
      | undefined;
    const userTotals = rawUserTotals as unknown as
      | {
          count?: string | number;
          invited_count?: string | number;
          active_count?: string | number;
        }
      | undefined;
    const recentLogins = rawRecentLogins as unknown as
      | { count?: string | number }
      | undefined;
    const usersPerCompany = rawUsersPerCompany as unknown as Array<{
      companyId: string | number;
      companyName: string;
      userCount: string | number;
    }>;

    return {
      totalCompanies: Number(companyTotals?.count || 0),
      activeCompanies: Number(companyTotals?.active_count || 0),
      totalUsers: Number(userTotals?.count || 0),
      invitedUsers: Number(userTotals?.invited_count || 0),
      activeUsers: Number(userTotals?.active_count || 0),
      recentLogins: Number(recentLogins?.count || 0),
      usersPerCompany: usersPerCompany.map((row) => ({
        companyId: Number(row.companyId),
        companyName: String(row.companyName),
        userCount: Number(row.userCount || 0)
      }))
    };
  });

export const createImpersonationAudit = async (input: {
  adminUserId: number;
  targetUserId: number;
  companyId: number | null;
}) =>
  withDb(async (db) => {
    const [record] = await db("impersonation_audit")
      .insert({
        admin_user_id: input.adminUserId,
        target_user_id: input.targetUserId,
        company_id: input.companyId
      })
      .returning("*");
    return record;
  });

export const closeImpersonationAudit = async (auditId: number) =>
  withDb(async (db) =>
    db("impersonation_audit").where({ id: auditId }).update({
      ended_at: db.fn.now()
    })
  );

export const buildSessionUser = async (userId: number): Promise<SessionUser | null> =>
  withDb(async (db) => {
    const row = await db("users as u")
      .leftJoin("companies as c", "c.id", "u.company_id")
      .select(
        "u.id as user_id",
        "u.email",
        "u.full_name",
        "u.role",
        "u.company_id",
        "c.slug as company_slug",
        "c.name as company_name"
      )
      .where("u.id", userId)
      .first();

    if (!row) {
      return null;
    }

    return {
      userId: row.user_id,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
      companyId: row.company_id,
      companySlug: row.company_slug,
      companyName: row.company_name
    };
  });

export const getExampleDashboardSnapshot = async (
  company: CompanyRecord,
  session: SessionUser
): Promise<ExampleDashboardSnapshot> =>
  withDb(async (db) => {
    const [memberCount, pendingInvites, recentImpersonations] = await Promise.all([
      db("users").count<{ count: string }>("id as count").where({ company_id: company.id }).first(),
      db("users")
        .count<{ count: string }>("id as count")
        .where({ company_id: company.id, invite_status: "pending" })
        .first(),
      db("impersonation_audit")
        .count<{ count: string }>("id as count")
        .where({ company_id: company.id })
        .whereRaw("started_at >= now() - interval '30 days'")
        .first()
    ]);

    return {
      headline: `${company.name} workspace`,
      subheadline: `Custom AI operations for ${session.fullName || session.email}.`,
      primaryStats: [
        {
          label: "Active members",
          value: `${Number(memberCount?.count || 0)}`,
          tone: "accent"
        },
        {
          label: "Pending invites",
          value: `${Number(pendingInvites?.count || 0)}`,
          tone: Number(pendingInvites?.count || 0) > 0 ? "warning" : "neutral"
        },
        {
          label: "Admin handoffs",
          value: `${Number(recentImpersonations?.count || 0)}`,
          tone: "neutral"
        }
      ],
      workstreams: [
        {
          title: "Lead intake",
          body: "Capture inbound company requests and route them into the tenant CRM workflow.",
          meta: "Pipeline automation"
        },
        {
          title: "AI operating copilots",
          body: "Surface tenant-specific playbooks, approvals, and exception handling in one place.",
          meta: "Decision support"
        },
        {
          title: "Client reporting",
          body: "Track health metrics, onboarding progress, and weekly outcomes by company.",
          meta: "Executive visibility"
        }
      ]
    };
  });
