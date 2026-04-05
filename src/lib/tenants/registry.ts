import { getTenantCatalogEntry, listTenantCatalogEntries } from "@/lib/tenants/catalog";
import type { TenantRegistryEntry } from "@/lib/types";

const sharedDashboard = () => import("@/tenants/client-workspace/dashboard");
const sharedServerActions = () => import("@/tenants/client-workspace/server");

const buildRegistryEntry = (key: string): TenantRegistryEntry => {
  const catalogEntry = getTenantCatalogEntry(key);

  if (!catalogEntry) {
    throw new Error(`Tenant catalog entry "${key}" is not defined.`);
  }

  return {
    ...catalogEntry,
    loadDashboard: sharedDashboard,
    loadServerActions: sharedServerActions
  };
};

const registry: Record<string, TenantRegistryEntry> = {
  "example-company": buildRegistryEntry("example-company"),
  "assembly-studio": buildRegistryEntry("assembly-studio"),
  "northpeak-ops": buildRegistryEntry("northpeak-ops"),
  "riverline-advisory": buildRegistryEntry("riverline-advisory")
};

export const getTenantRegistryEntry = (key: string) => registry[key] ?? null;

export const listTenantKeys = () => Object.keys(registry);

export const listTenantRegistryEntries = () => Object.values(registry);

export const listTenantTemplates = () =>
  listTenantCatalogEntries().filter((entry) => Boolean(registry[entry.key]));
