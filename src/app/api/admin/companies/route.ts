import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/auth/server";
import { createCompany, findCompanyBySlug } from "@/lib/db/repositories";
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

export async function POST(request: NextRequest) {
  const { response } = await requireAdminApiSession(request);
  if (response) {
    return response;
  }

  try {
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

    const existing = await findCompanyBySlug(slug);
    if (existing) {
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

    const company = await createCompany({
      name: body.name,
      slug,
      dashboardKey: body.dashboardKey,
      status: body.status,
      brandingJson: body.brandingJson
    });

    return NextResponse.json({ company });
  } catch (error) {
    console.error("POST /api/admin/companies failed:", error);
    return NextResponse.json(
      {
        error: {
          code: "create-company-failed",
          message:
            error instanceof Error ? error.message : "Unable to create company."
        }
      },
      { status: 400 }
    );
  }
}
