import { getTenantRegistryEntry, listTenantKeys } from "@/lib/tenants/registry";

describe("tenant registry", () => {
  it("registers the example company tenant", () => {
    expect(listTenantKeys()).toContain("example-company");
    expect(getTenantRegistryEntry("example-company")?.displayName).toBe(
      "Example Company"
    );
  });

  it("returns null for unknown tenants", () => {
    expect(getTenantRegistryEntry("missing-tenant")).toBeNull();
  });
});
