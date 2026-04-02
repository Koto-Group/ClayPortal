/** @jest-environment node */

import { POST } from "@/app/api/auth/invite/accept/route";

jest.mock("@/lib/db/repositories", () => ({
  findInviteByToken: jest.fn().mockResolvedValue({
    id: 9,
    company_id: 5,
    company_slug: "example-company",
    company_name: "Example Company",
    accepted_at: null,
    expires_at: new Date(Date.now() - 60_000).toISOString(),
    email: "member@example.com"
  }),
  findUserByEmail: jest.fn()
}));

describe("POST /api/auth/invite/accept", () => {
  it("rejects expired invites", async () => {
    const request = new Request("http://localhost/api/auth/invite/accept", {
      method: "POST",
      body: JSON.stringify({
        token: "123456789012",
        companySlug: "example-company",
        fullName: "Member",
        password: "password123"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(payload.error.code).toBe("invite-expired");
  });
});
