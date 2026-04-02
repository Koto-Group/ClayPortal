import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseAdminAuth } from "@/lib/auth/firebase-admin";
import { applySessionCookie } from "@/lib/auth/session";
import {
  acceptInvite,
  buildSessionUser,
  findInviteByToken,
  findUserByEmail
} from "@/lib/db/repositories";

export const runtime = "nodejs";

const bodySchema = z.object({
  token: z.string().min(12),
  companySlug: z.string().min(1),
  fullName: z.string().min(2),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const invite = await findInviteByToken(body.token);

    if (!invite || invite.company_slug !== body.companySlug) {
      return NextResponse.json(
        {
          error: {
            code: "invite-not-found",
            message: "That invite link is invalid."
          }
        },
        { status: 404 }
      );
    }

    if (invite.accepted_at) {
      return NextResponse.json(
        {
          error: {
            code: "invite-already-used",
            message: "This invite has already been accepted."
          }
        },
        { status: 409 }
      );
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        {
          error: {
            code: "invite-expired",
            message: "This invite has expired."
          }
        },
        { status: 410 }
      );
    }

    const adminAuth = await getFirebaseAdminAuth();
    const existingUser = await findUserByEmail(invite.email);

    let firebaseUid = existingUser?.firebase_uid ?? null;

    try {
      if (firebaseUid) {
        await adminAuth.updateUser(firebaseUid, {
          displayName: body.fullName,
          password: body.password
        });
      } else {
        const createdAuthUser = await adminAuth.createUser({
          email: invite.email,
          password: body.password,
          displayName: body.fullName
        });
        firebaseUid = createdAuthUser.uid;
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "auth/email-already-exists"
      ) {
        const authUser = await adminAuth.getUserByEmail(invite.email);
        firebaseUid = authUser.uid;
        await adminAuth.updateUser(authUser.uid, {
          displayName: body.fullName,
          password: body.password
        });
      } else {
        throw error;
      }
    }

    if (!firebaseUid) {
      throw new Error("Unable to resolve a Firebase UID for the invited user.");
    }

    const acceptedUser = await acceptInvite({
      inviteId: invite.id,
      companyId: invite.company_id,
      email: invite.email,
      fullName: body.fullName,
      firebaseUid
    });

    const session = await buildSessionUser(acceptedUser.id);
    if (!session) {
      throw new Error("Unable to create the tenant session.");
    }

    const customToken = await adminAuth.createCustomToken(firebaseUid);
    const response = NextResponse.json({
      customToken,
      redirectTo: `/${session.companySlug}/dashboard`
    });

    return applySessionCookie(response, session);
  } catch (error) {
    console.error("POST /api/auth/invite/accept failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "invite-accept-failed",
          message:
            error instanceof Error ? error.message : "Unable to accept invite."
        }
      },
      { status: 400 }
    );
  }
}
