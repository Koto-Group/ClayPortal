"use client";

import Link from "next/link";
import { useState } from "react";

export function RegisterForm({
  companyName,
  companySlug,
  description,
  title
}: {
  companyName: string;
  companySlug: string;
  description: string;
  title: string;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    teamName: "",
    requestedRole: "company_member",
    useCase: "",
    notes: ""
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          companySlug,
          fullName: form.fullName,
          email: form.email,
          teamName: form.teamName,
          requestedRole: form.requestedRole,
          useCase: form.useCase,
          notes: form.notes
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to submit your request.");
      }

      setSuccessMessage(
        payload.message ||
          `Your ${companyName} access request has been captured for review.`
      );
      setForm({
        fullName: "",
        email: "",
        teamName: "",
        requestedRole: "company_member",
        useCase: "",
        notes: ""
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your request."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="panel auth-form auth-form-extended" onSubmit={onSubmit}>
      <div className="section-copy">
        <span className="eyebrow">Registration</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <label className="field">
        <span>Full name</span>
        <input
          name="fullName"
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Jordan Stakeholder"
          required
          type="text"
          value={form.fullName}
        />
      </label>

      <label className="field">
        <span>Work email</span>
        <input
          autoComplete="email"
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="jordan@company.com"
          required
          type="email"
          value={form.email}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Team or function</span>
          <input
            name="teamName"
            onChange={(event) => updateField("teamName", event.target.value)}
            placeholder="Client Success"
            type="text"
            value={form.teamName}
          />
        </label>

        <label className="field">
          <span>Requested role</span>
          <select
            name="requestedRole"
            onChange={(event) => updateField("requestedRole", event.target.value)}
            value={form.requestedRole}
          >
            <option value="company_member">Company member</option>
            <option value="company_admin">Company admin</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Use case</span>
        <textarea
          name="useCase"
          onChange={(event) => updateField("useCase", event.target.value)}
          placeholder="I need access for approvals, reporting, and weekly delivery reviews."
          required
          rows={4}
          value={form.useCase}
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          name="notes"
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Add any deadlines, stakeholders, or context for the request."
          rows={3}
          value={form.notes}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}
      {successMessage ? <p className="form-success">{successMessage}</p> : null}

      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Submitting..." : "Request access"}
      </button>

      <p className="auth-form-helper">
        Already invited?
        {" "}
        <Link href={`/${companySlug}/login`}>Return to sign in</Link>
      </p>
    </form>
  );
}
