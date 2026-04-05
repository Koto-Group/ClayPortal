"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { metricsCards } from "@/lib/admin/metrics";
import type {
  AccessRequestSummary,
  AdminMetrics,
  CompanySummary,
  SessionUser,
  TenantCatalogEntry,
  UserSummary
} from "@/lib/types";
import { useAuthBridge } from "@/providers/auth-provider";

type AdminWorkspaceProps = {
  accessRequests: AccessRequestSummary[];
  metrics: AdminMetrics;
  companies: CompanySummary[];
  dashboardTemplates: TenantCatalogEntry[];
  users: UserSummary[];
  session: SessionUser;
};

export function AdminWorkspace({
  accessRequests,
  dashboardTemplates,
  metrics,
  companies,
  users,
  session
}: AdminWorkspaceProps) {
  const router = useRouter();
  const { signInWithBridgeToken } = useAuthBridge();
  const defaultDashboardKey = dashboardTemplates[0]?.key ?? "example-company";
  const [companyForm, setCompanyForm] = useState({
    name: "",
    slug: "",
    dashboardKey: defaultDashboardKey,
    status: "active"
  });
  const [inviteForm, setInviteForm] = useState({
    email: "",
    fullName: "",
    role: "company_admin",
    companyId: companies[0]?.id ? String(companies[0].id) : ""
  });
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [editingCompanyForm, setEditingCompanyForm] = useState({
    name: "",
    slug: "",
    dashboardKey: defaultDashboardKey,
    status: "active"
  });
  const [busyState, setBusyState] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const companyCards = useMemo(() => metricsCards(metrics), [metrics]);

  const handleCreateCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyState("create-company");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(companyForm)
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to create company.");
      }
      setMessage(`Created ${payload.company.name}.`);
      setCompanyForm({
        name: "",
        slug: "",
        dashboardKey: defaultDashboardKey,
        status: "active"
      });
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create company.");
    } finally {
      setBusyState(null);
    }
  };

  const handleInviteUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyState("invite-user");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: inviteForm.email,
          fullName: inviteForm.fullName,
          role: inviteForm.role,
          companyId: Number(inviteForm.companyId)
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to send invite.");
      }
      setMessage(`Invite sent to ${payload.user.email}.`);
      setInviteForm((current) => ({
        ...current,
        email: "",
        fullName: ""
      }));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send invite.");
    } finally {
      setBusyState(null);
    }
  };

  const handleResendInvite = async (userId: number) => {
    setBusyState(`resend-${userId}`);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to resend invite.");
      }
      setMessage(`Invite resent to ${payload.user.email}.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend invite.");
    } finally {
      setBusyState(null);
    }
  };

  const handleImpersonate = async (userId: number) => {
    setBusyState(`impersonate-${userId}`);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/impersonation/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to impersonate user.");
      }
      await signInWithBridgeToken(payload.customToken);
      router.push(payload.redirectTo);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to impersonate user.");
      setBusyState(null);
    }
  };

  const startCompanyEdit = (company: CompanySummary) => {
    setEditingCompanyId(company.id);
    setEditingCompanyForm({
      name: company.name,
      slug: company.slug,
      dashboardKey: company.dashboard_key,
      status: company.status
    });
  };

  const handleUpdateCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCompanyId) {
      return;
    }

    setBusyState("update-company");
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/companies/${editingCompanyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editingCompanyForm)
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to update company.");
      }
      setMessage(`Updated ${payload.company.name}.`);
      setEditingCompanyId(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update company.");
    } finally {
      setBusyState(null);
    }
  };

  return (
    <div className="admin-layout">
      <section className="section-copy">
        <span className="eyebrow">Platform Console</span>
        <h1>ClayPortal admin</h1>
        <p>
          Manage companies, issue invites, and jump into tenant contexts without mixing platform logic into tenant modules.
        </p>
      </section>

      <section className="stats-grid">
        {companyCards.map((card) => (
          <article className="panel metric-panel" key={card.label}>
            <span className="panel-label">{card.label}</span>
            <strong className="metric-value">{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      {message ? <p className="panel message-panel">{message}</p> : null}

      <section className="section-grid">
        <form className="panel stacked-form" onSubmit={handleCreateCompany}>
          <div className="panel-header">
            <div>
              <span className="panel-label">Create company</span>
              <h2>New tenant</h2>
            </div>
          </div>
          <label className="field">
            <span>Name</span>
            <input
              onChange={(event) =>
                setCompanyForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Example Company"
              required
              type="text"
              value={companyForm.name}
            />
          </label>
          <label className="field">
            <span>Slug</span>
            <input
              onChange={(event) =>
                setCompanyForm((current) => ({ ...current, slug: event.target.value }))
              }
              placeholder="example-company"
              required
              type="text"
              value={companyForm.slug}
            />
          </label>
          <label className="field">
            <span>Dashboard key</span>
            <select
              onChange={(event) =>
                setCompanyForm((current) => ({
                  ...current,
                  dashboardKey: event.target.value
                }))
              }
              value={companyForm.dashboardKey}
            >
              {dashboardTemplates.map((template) => (
                <option key={template.key} value={template.key}>
                  {template.displayName} · {template.segment}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select
              onChange={(event) =>
                setCompanyForm((current) => ({ ...current, status: event.target.value }))
              }
              value={companyForm.status}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <button className="primary-button" disabled={busyState === "create-company"} type="submit">
            {busyState === "create-company" ? "Creating..." : "Create company"}
          </button>
        </form>

        <form className="panel stacked-form" onSubmit={handleInviteUser}>
          <div className="panel-header">
            <div>
              <span className="panel-label">Invite user</span>
              <h2>Tenant access</h2>
            </div>
          </div>
          <label className="field">
            <span>Company</span>
            <select
              onChange={(event) =>
                setInviteForm((current) => ({ ...current, companyId: event.target.value }))
              }
              required
              value={inviteForm.companyId}
            >
              <option value="" disabled>
                Select a company
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Email</span>
            <input
              onChange={(event) =>
                setInviteForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="owner@example.com"
              required
              type="email"
              value={inviteForm.email}
            />
          </label>
          <label className="field">
            <span>Full name</span>
            <input
              onChange={(event) =>
                setInviteForm((current) => ({ ...current, fullName: event.target.value }))
              }
              placeholder="Jordan Client"
              required
              type="text"
              value={inviteForm.fullName}
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select
              onChange={(event) =>
                setInviteForm((current) => ({ ...current, role: event.target.value }))
              }
              value={inviteForm.role}
            >
              <option value="company_admin">Company admin</option>
              <option value="company_member">Company member</option>
            </select>
          </label>
          <button className="primary-button" disabled={busyState === "invite-user"} type="submit">
            {busyState === "invite-user" ? "Sending..." : "Send invite"}
          </button>
        </form>
      </section>

      {editingCompanyId ? (
        <form className="panel stacked-form" onSubmit={handleUpdateCompany}>
          <div className="panel-header">
            <div>
              <span className="panel-label">Edit company</span>
              <h2>Update tenant settings</h2>
            </div>
            <button
              className="link-button"
              onClick={() => setEditingCompanyId(null)}
              type="button"
            >
              Cancel
            </button>
          </div>
          <label className="field">
            <span>Name</span>
            <input
              onChange={(event) =>
                setEditingCompanyForm((current) => ({
                  ...current,
                  name: event.target.value
                }))
              }
              required
              type="text"
              value={editingCompanyForm.name}
            />
          </label>
          <label className="field">
            <span>Slug</span>
            <input
              onChange={(event) =>
                setEditingCompanyForm((current) => ({
                  ...current,
                  slug: event.target.value
                }))
              }
              required
              type="text"
              value={editingCompanyForm.slug}
            />
          </label>
          <label className="field">
            <span>Dashboard key</span>
            <select
              onChange={(event) =>
                setEditingCompanyForm((current) => ({
                  ...current,
                  dashboardKey: event.target.value
                }))
              }
              value={editingCompanyForm.dashboardKey}
            >
              {dashboardTemplates.map((template) => (
                <option key={template.key} value={template.key}>
                  {template.displayName} · {template.segment}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select
              onChange={(event) =>
                setEditingCompanyForm((current) => ({
                  ...current,
                  status: event.target.value
                }))
              }
              value={editingCompanyForm.status}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <button className="primary-button" disabled={busyState === "update-company"} type="submit">
            {busyState === "update-company" ? "Saving..." : "Save changes"}
          </button>
        </form>
      ) : null}

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">Companies</span>
            <h2>Tenant roster</h2>
          </div>
          <p>Signed in as {session.email}</p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Users</th>
                <th>Pending</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.slug}</td>
                  <td>{company.status}</td>
                  <td>{company.user_count}</td>
                  <td>{company.invited_user_count}</td>
                  <td>
                    <button className="link-button" onClick={() => startCompanyEdit(company)} type="button">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">Registration requests</span>
            <h2>Client onboarding queue</h2>
          </div>
          <p>{accessRequests.length} request(s)</p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Requested role</th>
                <th>Use case</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {accessRequests.length ? (
                accessRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.full_name}</strong>
                      <p>{request.email}</p>
                    </td>
                    <td>{request.company_name}</td>
                    <td>{request.requested_role}</td>
                    <td>
                      <strong>{request.use_case}</strong>
                      {request.team_name ? <p>Team: {request.team_name}</p> : null}
                    </td>
                    <td>{request.status}</td>
                    <td>{new Date(request.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No registration requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">Users</span>
            <h2>Access roster</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.company_name || "Platform"}</td>
                  <td>{user.role}</td>
                  <td>{user.invite_status}</td>
                  <td>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never"}</td>
                  <td className="action-cell">
                    {user.invite_status === "pending" && user.role !== "platform_admin" ? (
                      <button
                        className="link-button"
                        disabled={busyState === `resend-${user.id}`}
                        onClick={() => handleResendInvite(user.id)}
                        type="button"
                      >
                        Resend
                      </button>
                    ) : null}
                    {user.role !== "platform_admin" ? (
                      <button
                        className="link-button"
                        disabled={busyState === `impersonate-${user.id}`}
                        onClick={() => handleImpersonate(user.id)}
                        type="button"
                      >
                        Impersonate
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
