/** @jest-environment node */

import { POST } from "@/app/api/admin/companies/route";

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
  findCompanyBySlug: jest.fn().mockResolvedValue(null),
  createCompany: jest.fn().mockResolvedValue({
    id: 3,
    name: "Example Company",
    slug: "example-company",
    dashboard_key: "example-company",
    status: "active",
    branding_json: null
  })
}));

describe("POST /api/admin/companies", () => {
  it("creates a company for a registered dashboard", async () => {
    const request = new Request("http://localhost/api/admin/companies", {
      method: "POST",
      body: JSON.stringify({
        name: "Example Company",
        slug: "example-company",
        dashboardKey: "example-company",
        status: "active"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const response = await POST(request as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.company.slug).toBe("example-company");
  });
});
