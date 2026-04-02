import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { isReservedSlug } from "@/lib/tenancy/reserved-slugs";

const isAssetPath = (pathname: string) =>
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api") ||
  pathname.includes(".") ||
  pathname === "/favicon.ico";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAssetPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!session || session.role !== "platform_admin") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2 && segments[1] === "dashboard") {
    const companySlug = segments[0];
    if (isReservedSlug(companySlug)) {
      return NextResponse.next();
    }

    if (
      !session ||
      session.role === "platform_admin" ||
      session.companySlug !== companySlug
    ) {
      const loginUrl = new URL(`/${companySlug}/login`, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
