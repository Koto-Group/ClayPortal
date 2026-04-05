# ClayPortal AI Context

## Product framing
ClayPortal is a multi-tenant Next.js platform for building separate client workspaces on a shared base.
The design direction for tenant dashboards is informed by the local `Geo-Robotics-main` reference: dense operations layout, clearer navigation, and command-center style information grouping.
The implementation in this repo is not a clone of that app. It adapts the shell ideas into the current tenant-auth model and existing admin stack.

## Core routes
- `/` is the marketing site and now highlights multiple client workspace templates.
- `/[companySlug]` is a public workspace overview for a specific client.
- `/[companySlug]/login` is the tenant sign-in route.
- `/[companySlug]/register` is the tenant registration route.
- `/[companySlug]/invite/[token]` is invite activation for approved users.
- `/[companySlug]/dashboard` is the authenticated client dashboard.
- `/admin/login` and `/admin/dashboard` are the platform-admin routes.

## Tenant model
Tenant dashboards are separated by `company.slug` and `company.dashboard_key`.
The registry lives in [src/lib/tenants/registry.ts](/Users/ronnieachkar/Desktop/clayportal/src/lib/tenants/registry.ts).
Shared tenant metadata lives in [src/lib/tenants/catalog.ts](/Users/ronnieachkar/Desktop/clayportal/src/lib/tenants/catalog.ts).
Current workspace templates:
- `example-company`
- `assembly-studio`
- `northpeak-ops`
- `riverline-advisory`

## Auth and registration rules
Tenant login is invite-based.
Registration does not create a live account directly.
Registration creates an `access_requests` record through [src/app/api/auth/register/route.ts](/Users/ronnieachkar/Desktop/clayportal/src/app/api/auth/register/route.ts).
Admins review those requests in the admin console and can then issue real invites.
Invite acceptance creates or updates the Firebase user and activates the tenant session.

## Dashboard implementation
Shared tenant dashboard rendering lives in [src/components/tenant/client-workspace-dashboard.tsx](/Users/ronnieachkar/Desktop/clayportal/src/components/tenant/client-workspace-dashboard.tsx).
Tenant-specific copy and lane structure are generated in [src/lib/tenants/dashboard-content.ts](/Users/ronnieachkar/Desktop/clayportal/src/lib/tenants/dashboard-content.ts).
Database-backed tenant metrics come from [src/lib/db/repositories.ts](/Users/ronnieachkar/Desktop/clayportal/src/lib/db/repositories.ts).

## Admin implementation
The admin console can:
- create companies
- choose a dashboard template
- invite tenant users
- view registration requests
- impersonate tenant users

The main admin UI is [src/components/admin/admin-workspace.tsx](/Users/ronnieachkar/Desktop/clayportal/src/components/admin/admin-workspace.tsx).

## Data additions
Registration requests are stored in the `access_requests` table.
Migration: [db/migrations/20260404000100_create_access_requests_table.js](/Users/ronnieachkar/Desktop/clayportal/db/migrations/20260404000100_create_access_requests_table.js)

## Seeded demo tenants
Seed file: [db/seeds/001_example_company.js](/Users/ronnieachkar/Desktop/clayportal/db/seeds/001_example_company.js)

Expected demo slugs:
- `example-company`
- `assembly`
- `northpeak`
- `riverline`

## Prompting guidance for AI
When extending this repo, keep these constraints:
- Preserve the multi-tenant separation. Changes for one client should usually be driven by `dashboard_key` or `companySlug`, not global branching in random components.
- Keep tenant registration invite-safe. Do not convert public registration into automatic account creation unless explicitly requested.
- Reuse the shared tenant shell where possible and put client-specific language in tenant metadata or snapshot builders.
- Treat `Geo-Robotics-main` as a layout and product-structure reference, not as code to copy.
- Prefer additive changes to shared CSS because `src/app/globals.css` already contains multiple active landing-page experiments.

## Useful prompt starter
`Use docs/ai-context.md as the source of truth. This is a multi-tenant ClayPortal app with invite-based tenant auth, access-request registration, and client dashboards separated by dashboard_key. Keep the Geo-Robotics-inspired shell, but preserve the existing Next.js multi-tenant architecture.`
