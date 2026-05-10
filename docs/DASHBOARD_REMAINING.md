# Dashboard & applications — remaining work

Use this list as a backlog for Opus / implementation passes. Items are ordered roughly by impact.

## Product / UX

1. **Program linking** — Wire `programId` from the directory when creating/editing applications (today mostly free-text `programName`).
2. **Application groups** — UI for `applicationGroupId`: multiple program rows under one logical “same intake / same uni” application.
3. **Kanban column persistence** — Optional `kanbanColumn` / `kanbanPosition` in schema for custom ordering within a lane (drag order saved).
4. **Notifications** — Deadlines, status changes, team invites (email or in-app).
5. **Post-login routing** — Send incomplete onboarding users to `/dashboard/onboarding` from any `/dashboard/*` attempt (currently gated via layout redirect).
6. **Guest access** — Hard 401/redirect for unauthenticated hits on dashboard routes (verify middleware or layout coverage).

## Team & collaboration

7. **Team roles UI** — Surface `TeamMemberRole` (promote, remove) beyond placeholder copy.
8. **Invite flow** — Pending invites, revoke/regenerate invite codes, optional email invite links.
9. **Activity feed** — Team timeline of application updates (optional).

## Community data (dashboard)

10. **Submission detail** (`/dashboard/community-data/submissions/[id]`) — Align shell with `DashboardPageIntro` + community-style layout (still uses older patterns in places).
11. **Moderation hooks** — If users are moderators/admins, surfacing queues (depends on product).

## Technical / quality

12. **Prisma client** — Run `prisma generate` on **Node ≥ 20** after migrations so list queries and includes type-check cleanly in CI.
13. **Tests** — Server actions for applications/teams (status update, create, mirror rules).
14. **Image domains** — Extend `next.config` `images.remotePatterns` if OAuth providers beyond Google are added.
15. **Accessibility** — Kanban drag-and-drop has no keyboard alternative; add move actions in edit sheet or a dialog for WCAG.

## Nice-to-have polish

16. **Kanban compact mode** — Optional cluster key by `universityId` when present (stronger dedupe than name+program text).
17. **Export** — CSV of applications for a user or team.
18. **Dashboard home metrics** — Replace static “Plan / Share / Explore” cards with real counts from DB.

---

_Last updated alongside breadcrumb intro, compact Kanban stacks, and profile form styling pass._
