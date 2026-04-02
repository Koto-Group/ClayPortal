import { metricsCards } from "@/lib/admin/metrics";

describe("metricsCards", () => {
  it("maps admin metrics into dashboard cards", () => {
    const cards = metricsCards({
      totalCompanies: 12,
      activeCompanies: 10,
      totalUsers: 42,
      invitedUsers: 7,
      activeUsers: 35,
      recentLogins: 11,
      usersPerCompany: []
    });

    expect(cards).toEqual([
      { label: "Companies", value: "12", detail: "10 active" },
      { label: "Users", value: "42", detail: "35 active" },
      {
        label: "Invites",
        value: "7",
        detail: "11 recent logins this week"
      }
    ]);
  });
});
