import { assertTenantSlug, isReservedSlug } from "@/lib/tenancy/reserved-slugs";

describe("reserved slugs", () => {
  it("flags reserved namespaces", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("example-company")).toBe(false);
  });

  it("normalizes valid slugs and rejects reserved ones", () => {
    expect(assertTenantSlug("Example-Company".toLowerCase())).toBe("example-company");
    expect(() => assertTenantSlug("api")).toThrow("reserved");
  });
});
