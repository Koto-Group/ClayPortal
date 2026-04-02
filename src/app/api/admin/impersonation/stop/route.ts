import { NextResponse, type NextRequest } from "next/server";
import { applySessionCookie, getSessionFromRequest } from "@/lib/auth/session";
import { getFirebaseAdminAuth } from "@/lib/auth/firebase-admin";
import { closeImpersonationAudit, findUserById } from "@/lib/db/repositories";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session?.impersonation) {
    return NextResponse.json(
      {
        error: {
          code: "not-impersonating",
          message: "No impersonation session is active."
        }
      },
      { status: 400 }
    );
  }

  const originalAdmin = await findUserById(session.impersonation.originalAdminUserId);
  if (!originalAdmin?.firebase_uid) {
    return NextResponse.json(
      {
        error: {
          code: "admin-restore-failed",
          message: "The original admin account could not be restored."
        }
      },
      { status: 500 }
    );
  }

  await closeImpersonationAudit(session.impersonation.auditId);

  const restoredSession = {
    userId: session.impersonation.originalAdminUserId,
    email: session.impersonation.originalAdminEmail,
    fullName: session.impersonation.originalAdminName,
    role: session.impersonation.originalAdminRole,
    companyId: session.impersonation.originalCompanyId,
    companySlug: session.impersonation.originalCompanySlug,
    companyName: session.impersonation.originalCompanyName
  };

  const adminAuth = await getFirebaseAdminAuth();
  const customToken = await adminAuth.createCustomToken(originalAdmin.firebase_uid);
  const response = NextResponse.json({
    customToken,
    redirectTo: "/admin/dashboard"
  });

  return applySessionCookie(response, restoredSession);
}
