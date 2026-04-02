"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthBridge } from "@/providers/auth-provider";

export function InviteAcceptForm({
  companySlug,
  companyName,
  token
}: {
  companySlug: string;
  companyName: string;
  token: string;
}) {
  const router = useRouter();
  const { signInWithBridgeToken } = useAuthBridge();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/invite/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          companySlug,
          fullName,
          password
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to accept invite.");
      }

      await signInWithBridgeToken(payload.customToken);
      router.push(payload.redirectTo);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to accept invite."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="panel auth-form" onSubmit={onSubmit}>
      <div className="section-copy">
        <span className="eyebrow">Invite Activation</span>
        <h1>Join {companyName}</h1>
        <p>Set your account details and enter the tenant workspace.</p>
      </div>
      <label className="field">
        <span>Full name</span>
        <input
          name="fullName"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Jane Operator"
          required
          type="text"
          value={fullName}
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          autoComplete="new-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          required
          type="password"
          value={password}
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Activating..." : "Activate account"}
      </button>
    </form>
  );
}
