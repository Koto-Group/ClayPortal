import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";

const push = jest.fn();
const refresh = jest.fn();
const signInWithBridgeToken = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh
  })
}));

jest.mock("@/providers/auth-provider", () => ({
  useAuthBridge: () => ({
    signInWithBridgeToken
  })
}));

describe("ImpersonationBanner", () => {
  beforeEach(() => {
    push.mockReset();
    refresh.mockReset();
    signInWithBridgeToken.mockReset();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        customToken: "admin-token",
        redirectTo: "/admin/dashboard"
      })
    }) as jest.Mock;
  });

  it("restores the admin session", async () => {
    render(
      <ImpersonationBanner
        session={{
          userId: 2,
          email: "member@example.com",
          fullName: "Member",
          role: "company_admin",
          companyId: 4,
          companySlug: "example-company",
          companyName: "Example Company",
          impersonation: {
            auditId: 12,
            originalAdminUserId: 1,
            originalAdminEmail: "admin@example.com",
            originalAdminName: "Admin",
            originalAdminRole: "platform_admin",
            originalCompanyId: null,
            originalCompanySlug: null,
            originalCompanyName: null
          }
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /stop impersonation/i }));

    await waitFor(() => {
      expect(signInWithBridgeToken).toHaveBeenCalledWith("admin-token");
      expect(push).toHaveBeenCalledWith("/admin/dashboard");
      expect(refresh).toHaveBeenCalled();
    });
  });
});
