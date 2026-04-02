const reservedSlugs = new Set([
  "admin",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml"
]);

export const isReservedSlug = (value: string) =>
  reservedSlugs.has(value.trim().toLowerCase());

export const assertTenantSlug = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    throw new Error("Company slug is required.");
  }
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    throw new Error("Company slug may only contain lowercase letters, numbers, and hyphens.");
  }
  if (isReservedSlug(normalized)) {
    throw new Error("That company slug is reserved.");
  }
  return normalized;
};
