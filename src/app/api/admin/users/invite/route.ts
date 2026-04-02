import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/auth/server";
import {
  createOrRefreshInvite,
  createOrUpdateInvitedUser,
  findCompanyById,
  findUserById
} from "@/lib/db/repositories";
import { sendInviteEmail } from "@/lib/email/invite-email";
import { createInviteToken, inviteExpiresAt } from "@/lib/security/invite-tokens";
import { buildAppUrl } from "@/lib/utils/url";

export const runtime = "nodejs";

const inviteSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().min(2).optional(),
  role: z.enum(["company_admin", "company_member"]).optional(),
  companyId: z.number().int().positive().optional(),
  userId: z.number().int().positive().optional()
});

export async function POST(request: NextRequest) {
  const authResult = await requireAdminApiSession(request);
  if (authResult.response) {
    return authResult.response;
  }

  try {
    const body = inviteSchema.parse(await request.json());

    let email: string;
    let fullName: string | null;
    let role: "company_admin" | "company_member";
    let companyId: number;

    if (body.userId) {
      const existingUser = await findUserById(body.userId);
      if (!existingUser || !existingUser.company_id || existingUser.role === "platform_admin") {
        return NextResponse.json(
          {
            error: {
              code: "user-not-invitable",
              message: "That user cannot receive a tenant invite."
            }
          },
          { status: 400 }
        );
      }

      email = existingUser.email;
      fullName = existingUser.full_name;
      role = existingUser.role as "company_admin" | "company_member";
      companyId = existingUser.company_id;
    } else {
      if (!body.email || !body.role || !body.companyId) {
        return NextResponse.json(
          {
            error: {
              code: "invalid-request",
              message: "email, role, and companyId are required."
            }
          },
          { status: 400 }
        );
      }

      email = body.email.toLowerCase();
      fullName = body.fullName || null;
      role = body.role;
      companyId = body.companyId;
    }

    const company = await findCompanyById(companyId);
    if (!company) {
      return NextResponse.json(
        {
          error: {
            code: "company-not-found",
            message: "The target company could not be found."
          }
        },
        { status: 404 }
      );
    }

    const user = await createOrUpdateInvitedUser({
      email,
      fullName,
      role,
      companyId
    });

    const rawToken = createInviteToken();
    await createOrRefreshInvite({
      companyId,
      email,
      role,
      invitedByUserId: authResult.session!.userId,
      token: rawToken,
      expiresAt: inviteExpiresAt()
    });

    const inviteUrl = buildAppUrl(`/${company.slug}/invite/${rawToken}`);
    await sendInviteEmail({
      company,
      email,
      inviteUrl,
      invitedByEmail: authResult.session!.email
    });

    return NextResponse.json({
      user,
      inviteUrl
    });
  } catch (error) {
    console.error("POST /api/admin/users/invite failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "invite-user-failed",
          message:
            error instanceof Error ? error.message : "Unable to send invite."
        }
      },
      { status: 400 }
    );
  }
}
