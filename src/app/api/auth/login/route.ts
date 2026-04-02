import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseAdminAuth } from "@/lib/auth/firebase-admin";
import { verifyEmailPassword } from "@/lib/auth/firebase-web";
import { applySessionCookie } from "@/lib/auth/session";
import {
  buildSessionUser,
  findCompanyBySlug,
  findUserByEmail,
  findUserByFirebaseUid,
  recordSuccessfulLogin
} from "@/lib/db/repositories";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companySlug: z.string().optional(),
  variant: z.enum(["admin", "tenant"])
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const normalizedEmail = body.email.toLowerCase();
    const credential = await verifyEmailPassword(normalizedEmail, body.password);
    const firebaseUid = credential.user.uid;

    const dbUser =
      (await findUserByFirebaseUid(firebaseUid)) ||
      (await findUserByEmail(normalizedEmail));

    if (!dbUser) {
      return NextResponse.json(
        {
          error: {
            code: "user-not-found",
            message: "No application user record exists for this account."
          }
        },
        { status: 404 }
      );
    }

    if (body.variant === "admin") {
      if (dbUser.role !== "platform_admin") {
        return NextResponse.json(
          {
            error: {
              code: "forbidden",
              message: "This account does not have platform admin access."
            }
          },
          { status: 403 }
        );
      }
    } else {
      if (dbUser.role === "platform_admin" || dbUser.invite_status !== "active") {
        return NextResponse.json(
          {
            error: {
              code: "tenant-access-denied",
              message: "This tenant account is not active yet."
            }
          },
          { status: 403 }
        );
      }

      if (!body.companySlug) {
        return NextResponse.json(
          {
            error: {
              code: "missing-company",
              message: "Tenant login requires a company slug."
            }
          },
          { status: 400 }
        );
      }

      const company = await findCompanyBySlug(body.companySlug);
      if (!company || company.id !== dbUser.company_id || company.status !== "active") {
        return NextResponse.json(
          {
            error: {
              code: "tenant-not-found",
              message: "This company workspace is not available."
            }
          },
          { status: 404 }
        );
      }
    }

    await recordSuccessfulLogin(dbUser.id);
    const session = await buildSessionUser(dbUser.id);
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: "session-build-failed",
            message: "Unable to build an authenticated session."
          }
        },
        { status: 500 }
      );
    }

    const adminAuth = await getFirebaseAdminAuth();
    const customToken = await adminAuth.createCustomToken(firebaseUid);
    const response = NextResponse.json({
      customToken,
      redirectTo:
        session.role === "platform_admin"
          ? "/admin/dashboard"
          : `/${session.companySlug}/dashboard`
    });

    return applySessionCookie(response, session);
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "login-failed",
          message: error instanceof Error ? error.message : "Unable to sign in."
        }
      },
      { status: 400 }
    );
  }
}
