"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthBridge } from "@/providers/auth-provider";

type LoginFormProps = {
  variant: "admin" | "tenant";
  companySlug?: string;
  title: string;
  description: string;
};

export function LoginForm({
  variant,
  companySlug,
  title,
  description
}: LoginFormProps) {
  const router = useRouter();
  const { signInWithBridgeToken } = useAuthBridge();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          companySlug,
          variant
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to sign in.");
      }

      await signInWithBridgeToken(payload.customToken);
      router.push(payload.redirectTo);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to sign in."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <div className="section-copy">
        <span className="eyebrow">{variant === "admin" ? "Platform Access" : "Company Access"}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <label className="field">
        <span>Email</span>
        <input
          autoComplete="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jane@company.com"
          required
          type="email"
          value={email}
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
