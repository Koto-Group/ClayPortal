import type { TenantRegistryEntry } from "@/lib/types";

const registry: Record<string, TenantRegistryEntry> = {
  "example-company": {
    key: "example-company",
    displayName: "Example Company",
    navigation: [
      {
        key: "overview",
        label: "Overview",
        description: "Core metrics and operating state"
      },
      {
        key: "playbooks",
        label: "Playbooks",
        description: "AI workflows and delivery patterns"
      },
      {
        key: "client-ops",
        label: "Client Ops",
        description: "Onboarding, support, and reporting"
      }
    ],
    loadDashboard: () => import("@/tenants/example-company/dashboard"),
    loadServerActions: () => import("@/tenants/example-company/server")
  }
};

export const getTenantRegistryEntry = (key: string) => registry[key] ?? null;

export const listTenantKeys = () => Object.keys(registry);
