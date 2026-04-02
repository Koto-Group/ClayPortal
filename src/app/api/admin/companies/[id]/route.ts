import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/auth/server";
import { findCompanyBySlug, updateCompany } from "@/lib/db/repositories";
import { listTenantKeys } from "@/lib/tenants/registry";
import { assertTenantSlug } from "@/lib/tenancy/reserved-slugs";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  dashboardKey: z.string().min(2),
  status: z.enum(["active", "draft", "disabled"]),
  brandingJson: z.record(z.unknown()).optional()
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminApiSession(request);
  if (response) {
    return response;
  }

  try {
    const { id } = await context.params;
    const body = bodySchema.parse(await request.json());
    const slug = assertTenantSlug(body.slug);

    if (!listTenantKeys().includes(body.dashboardKey)) {
      return NextResponse.json(
        {
          error: {
            code: "unknown-dashboard",
            message: "That dashboard key is not registered."
          }
        },
        { status: 400 }
      );
    }

    const duplicate = await findCompanyBySlug(slug);
    if (duplicate && duplicate.id !== Number(id)) {
      return NextResponse.json(
        {
          error: {
            code: "company-slug-taken",
            message: "That company slug is already in use."
          }
        },
        { status: 409 }
      );
    }

    const company = await updateCompany(Number(id), {
      name: body.name,
      slug,
      dashboardKey: body.dashboardKey,
      status: body.status,
      brandingJson: body.brandingJson
    });

    if (!company) {
      return NextResponse.json(
        {
          error: {
            code: "company-not-found",
            message: "The company could not be found."
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error("PATCH /api/admin/companies/:id failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "update-company-failed",
          message:
            error instanceof Error ? error.message : "Unable to update company."
        }
      },
      { status: 400 }
    );
  }
}
