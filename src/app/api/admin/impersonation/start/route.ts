import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/auth/server";
import { applySessionCookie } from "@/lib/auth/session";
import { getFirebaseAdminAuth } from "@/lib/auth/firebase-admin";
import {
  buildSessionUser,
  createImpersonationAudit,
  findUserById
} from "@/lib/db/repositories";

export const runtime = "nodejs";

const bodySchema = z.object({
  userId: z.number().int().positive()
});

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApiSession(request);
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const body = bodySchema.parse(await request.json());
    const targetUser = await findUserById(body.userId);

    if (!targetUser || !targetUser.company_id || targetUser.role === "platform_admin") {
      return NextResponse.json(
        {
          error: {
            code: "invalid-target",
            message: "That user cannot be impersonated."
          }
        },
        { status: 400 }
      );
    }

    if (!targetUser.firebase_uid) {
      return NextResponse.json(
        {
          error: {
            code: "missing-firebase-user",
            message: "The target user has not accepted their invite yet."
          }
        },
        { status: 409 }
      );
    }

    const targetSession = await buildSessionUser(targetUser.id);
    if (!targetSession) {
      throw new Error("Unable to construct impersonated session.");
    }

    const audit = await createImpersonationAudit({
      adminUserId: authResult.session!.userId,
      targetUserId: targetUser.id,
      companyId: targetUser.company_id
    });

    const impersonatedSession = {
      ...targetSession,
      impersonation: {
        auditId: audit.id,
        originalAdminUserId: authResult.session!.userId,
        originalAdminEmail: authResult.session!.email,
        originalAdminName: authResult.session!.fullName,
        originalAdminRole: authResult.session!.role,
        originalCompanyId: authResult.session!.companyId,
        originalCompanySlug: authResult.session!.companySlug,
        originalCompanyName: authResult.session!.companyName
      }
    };

    const adminAuth = await getFirebaseAdminAuth();
    const customToken = await adminAuth.createCustomToken(targetUser.firebase_uid);
    const response = NextResponse.json({
      customToken,
      redirectTo: `/${impersonatedSession.companySlug}/dashboard`
    });

    return applySessionCookie(response, impersonatedSession);
  } catch (error) {
    console.error("POST /api/admin/impersonation/start failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "impersonation-start-failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to begin impersonation."
        }
      },
      { status: 400 }
    );
  }
}
