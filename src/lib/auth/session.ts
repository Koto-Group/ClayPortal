import { jwtVerify, SignJWT } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import type { SessionUser } from "@/lib/types";

export const SESSION_COOKIE_NAME = "clayportal_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const getSessionSecret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error("SESSION_SECRET is required.");
  }
  return new TextEncoder().encode(value);
};

export const createSessionToken = async (session: SessionUser) =>
  new SignJWT({ user: session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSessionSecret());

export const verifySessionToken = async (token?: string | null) => {
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSessionSecret());
    return verified.payload.user as SessionUser;
  } catch {
    return null;
  }
};

export const getSessionFromRequest = async (
  request: NextRequest | { cookies: { get: (name: string) => { value?: string } | undefined } }
) => verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

export const getSessionFromCookies = async () => {
  const { cookies } = await import("next/headers");
  return verifySessionToken(cookies().get(SESSION_COOKIE_NAME)?.value);
};

export const applySessionCookie = async (
  response: NextResponse,
  session: SessionUser
) => {
  const token = await createSessionToken(session);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/"
  });

  return response;
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });

  return response;
};
