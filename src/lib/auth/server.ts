import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromCookies, getSessionFromRequest } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/types";

export const isAdminSession = (session: SessionUser | null): session is SessionUser =>
  Boolean(session && session.role === "platform_admin");

export const isTenantSessionForSlug = (
  session: SessionUser | null,
  slug: string
): session is SessionUser =>
  Boolean(
    session &&
      session.role !== "platform_admin" &&
      session.companySlug === slug
  );

export const requireAdminPageSession = async () => {
  const session = await getSessionFromCookies();
  if (!isAdminSession(session)) {
    redirect("/admin/login");
  }
  return session;
};

export const requireTenantPageSession = async (companySlug: string) => {
  const session = await getSessionFromCookies();
  if (!isTenantSessionForSlug(session, companySlug)) {
    redirect(`/${companySlug}/login`);
  }
  return session;
};

export const requireAdminApiSession = async (request: NextRequest) => {
  const session = await getSessionFromRequest(request);
  if (!isAdminSession(session)) {
    return {
      session: null,
      response: NextResponse.json(
        { error: { code: "unauthorized", message: "Admin access required." } },
        { status: 401 }
      )
    };
  }

  return { session, response: null };
};

export const requireTenantApiSession = async (
  request: NextRequest,
  companySlug: string
) => {
  const session = await getSessionFromRequest(request);
  if (!isTenantSessionForSlug(session, companySlug)) {
    return {
      session: null,
      response: NextResponse.json(
        {
          error: {
            code: "forbidden",
            message: "You do not have access to this company dashboard."
          }
        },
        { status: 403 }
      )
    };
  }

  return { session, response: null };
};
