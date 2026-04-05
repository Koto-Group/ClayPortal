import { notFound } from "next/navigation";
import { InviteAcceptForm } from "@/components/auth/invite-accept-form";
import { WorkspaceAuthShell } from "@/components/auth/workspace-auth-shell";
import { findInviteByToken } from "@/lib/db/repositories";
import { getTenantRegistryEntry } from "@/lib/tenants/registry";

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

  const registryEntry = getTenantRegistryEntry(invite.company_dashboard_key);
  if (!registryEntry) {
    notFound();
  }

  return (
    <WorkspaceAuthShell
      activeRoute={null}
      companyName={invite.company_name}
      companySlug={companySlug}
      content={registryEntry.register}
      segment={registryEntry.segment}
      summary={registryEntry.summary}
    >
      <InviteAcceptForm
        companyName={invite.company_name}
        companySlug={companySlug}
        token={token}
      />
    </WorkspaceAuthShell>
  );
}
