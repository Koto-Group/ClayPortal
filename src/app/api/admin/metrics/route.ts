import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/auth/server";
import { getAdminMetrics } from "@/lib/db/repositories";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { response } = await requireAdminApiSession(request);
  if (response) {
    return response;
  }

  const metrics = await getAdminMetrics();
  return NextResponse.json({ metrics });
}
