# `src/modules` — feature layout

This app groups code by **domain** so features stay easy to find and change.

## Conventions

| Path                           | Role                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `modules/<domain>/components/` | UI for that feature (client or server components).                                                             |
| `modules/<domain>/actions/`    | **Server actions** (`"use server"`) — thin entry points; validate input, call services, return `ActionResult`. |
| `modules/<domain>/services/`   | **Server-only** business logic: Prisma, external APIs, no React.                                               |
| `modules/<domain>/schema/`     | Zod (and similar) schemas shared by actions and forms.                                                         |
| `modules/<domain>/constants/`  | Enums, labels, static config.                                                                                  |
| `modules/shared/`              | Cross-feature UI and server helpers (form controls, `Container`, session).                                     |
| `app/`                         | Routes, layouts, metadata — **import** from `modules/`, keep files small.                                      |

## Why actions + services?

- **Actions** handle transport (Next server), auth/session, and user-facing errors.
- **Services** keep database rules testable and reusable (e.g. from a future job or admin tool).

## Community example

- `community/actions/submit-acceptance-record.action.ts` → `community/services/acceptance-record.service.ts`
- `community/actions/search-universities.action.ts` → `community/services/university.service.ts`
