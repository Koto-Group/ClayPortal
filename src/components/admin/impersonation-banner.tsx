"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthBridge } from "@/providers/auth-provider";
import type { SessionUser } from "@/lib/types";

export function ImpersonationBanner({ session }: { session: SessionUser }) {
  const router = useRouter();
  const { signInWithBridgeToken } = useAuthBridge();
  const [pending, setPending] = useState(false);

  if (!session.impersonation) {
    return null;
  }

  const handleStop = async () => {
    setPending(true);
    try {
      const response = await fetch("/api/admin/impersonation/stop", {
        method: "POST"
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to restore admin session.");
      }
      await signInWithBridgeToken(payload.customToken);
      router.push(payload.redirectTo);
      router.refresh();
    } catch (error) {
      console.error(error);
      setPending(false);
      return;
    }

    setPending(false);
  };

  return (
    <div className="impersonation-banner">
      <div>
        <strong>Impersonating {session.companyName || session.email}</strong>
        <span>
          Signed in as {session.email}. Restore {session.impersonation.originalAdminEmail} when you are done.
        </span>
      </div>
      <button className="secondary-button" disabled={pending} onClick={handleStop} type="button">
        {pending ? "Restoring..." : "Stop impersonation"}
      </button>
    </div>
  );
}
