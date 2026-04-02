import { notFound } from "next/navigation";
import { InviteAcceptForm } from "@/components/auth/invite-accept-form";
import { findInviteByToken } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params
}: {
  params: Promise<{ companySlug: string; token: string }>;
}) {
  const { companySlug, token } = await params;
  const invite = await findInviteByToken(token);

  if (!invite || invite.company_slug !== companySlug) {
    notFound();
  }

  return (
    <main className="auth-shell">
      <InviteAcceptForm
        companyName={invite.company_name}
        companySlug={companySlug}
        token={token}
      />
    </main>
  );
}
