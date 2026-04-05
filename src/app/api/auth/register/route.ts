import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createAccessRequest,
  findCompanyBySlug,
  findOpenAccessRequestByEmail,
  findUserByEmail
} from "@/lib/db/repositories";

export const runtime = "nodejs";

const bodySchema = z.object({
  companySlug: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  teamName: z.string().optional(),
  requestedRole: z.enum(["company_admin", "company_member"]),
  useCase: z.string().min(12),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const normalizedEmail = body.email.toLowerCase();
    const company = await findCompanyBySlug(body.companySlug);

    if (!company || company.status !== "active") {
      return NextResponse.json(
        {
          error: {
            code: "workspace-not-available",
            message: "This workspace is not accepting registrations right now."
          }
        },
        { status: 404 }
      );
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser && existingUser.company_id === company.id) {
      if (existingUser.invite_status === "active") {
        return NextResponse.json(
          {
            error: {
              code: "account-already-active",
              message: "This email already has an active account. Use the sign in page."
            }
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: {
            code: "invite-already-pending",
            message:
              "An invite is already pending for this email. Check your inbox or ask an admin to resend it."
          }
        },
        { status: 409 }
      );
    }

    if (existingUser && existingUser.company_id && existingUser.company_id !== company.id) {
      return NextResponse.json(
        {
          error: {
            code: "account-linked-elsewhere",
            message:
              "This email is already linked to another company workspace. Contact the ClayPortal team for help."
          }
        },
        { status: 409 }
      );
    }

    const existingRequest = await findOpenAccessRequestByEmail(company.id, normalizedEmail);
    if (existingRequest) {
      return NextResponse.json({
        ok: true,
        message:
          "A workspace request for this email is already in review. The team will follow up soon."
      });
    }

    await createAccessRequest({
      companyId: company.id,
      fullName: body.fullName,
      email: normalizedEmail,
      requestedRole: body.requestedRole,
      teamName: body.teamName,
      useCase: body.useCase,
      notes: body.notes
    });

    return NextResponse.json({
      ok: true,
      message:
        "Request received. The ClayPortal team can review it from the admin console and issue an invite."
    });
  } catch (error) {
    console.error("POST /api/auth/register failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "registration-failed",
          message:
            error instanceof Error
              ? error.message
              : "Unable to submit the registration request."
        }
      },
      { status: 400 }
    );
  }
}
