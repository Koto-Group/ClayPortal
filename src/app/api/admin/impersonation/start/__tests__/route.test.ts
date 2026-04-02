/** @jest-environment node */

import { POST } from "@/app/api/admin/impersonation/start/route";

jest.mock("@/lib/auth/server", () => ({
  requireAdminApiSession: jest.fn().mockResolvedValue({
    session: {
      userId: 1,
      email: "admin@example.com",
      fullName: "Admin",
      role: "platform_admin",
      companyId: null,
      companySlug: null,
      companyName: null
    },
    response: null
  })
}));

jest.mock("@/lib/db/repositories", () => ({
  findUserById: jest.fn().mockResolvedValue({
    id: 22,
    email: "member@example.com",
    full_name: "Member",
    firebase_uid: "firebase-22",
    role: "company_member",
    company_id: 8,
    invite_status: "active"
  }),
  buildSessionUser: jest.fn().mockResolvedValue({
    userId: 22,
    email: "member@example.com",
    fullName: "Member",
    role: "company_member",
    companyId: 8,
    companySlug: "example-company",
    companyName: "Example Company"
  }),
  createImpersonationAudit: jest.fn().mockResolvedValue({
    id: 77
  })
}));

jest.mock("@/lib/auth/firebase-admin", () => ({
  getFirebaseAdminAuth: jest.fn().mockResolvedValue({
    createCustomToken: jest.fn().mockResolvedValue("impersonation-token")
  })
}));

jest.mock("@/lib/auth/session", () => ({
  applySessionCookie: jest.fn().mockImplementation((response) => response)
}));

describe("POST /api/admin/impersonation/start", () => {
  it("issues a custom token and redirect path", async () => {
    const request = new Request("http://localhost/api/admin/impersonation/start", {
      method: "POST",
      body: JSON.stringify({ userId: 22 }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const response = await POST(request as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.customToken).toBe("impersonation-token");
    expect(payload.redirectTo).toBe("/example-company/dashboard");
  });
});
