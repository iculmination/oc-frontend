# Outer Colony Codebase Specification

This document defines mandatory coding and structure rules for both frontend and backend.

## 1. Goals

- Keep codebase predictable and easy to navigate.
- Minimize style drift between contributors.
- Enforce explicit boundaries between layers and business entities.
- Make refactoring and onboarding straightforward.

---

## 2. Frontend Specification (Next.js / React)

## 2.1 Naming and File Conventions

- File and folder names: **kebab-case** only.
- Component file name must match component purpose.
- One component per file.
- Default export is allowed **only** for:
  - `app/**/page.tsx`
  - `app/**/layout.tsx`
- All other modules must use named exports.

## 2.2 Components and Functions

- Use `function` declarations for all functions.
- Do not use arrow functions for component declarations or utility functions.
- Component props interface must be declared in the same file as the component.
- Keep components focused:
  - UI components in `components/ui/*`
  - Feature components in `components/<feature-name>/*`

## 2.3 Types

- Business types must be grouped by entity in `lib/types/*entity-name*.ts`.
- Example:
  - `lib/types/user.ts`
  - `lib/types/game.ts`
  - `lib/types/card.ts`
- Do not keep business types inside feature components unless strictly local/private.
- Shared API response/request types should also live in entity type files.

## 2.4 Environment Variables

- Never access `process.env` directly in feature code.
- All envs must go through centralized validated modules.
- Validation is mandatory (e.g. `zod`).
- Recommended:
  - `lib/config/env.ts` for client-safe envs (`NEXT_PUBLIC_*`)
  - `lib/config/env-server.ts` for server-only envs if needed

## 2.5 Data Fetching and Auth

- Use centralized HTTP layer (`lib/api/*`) for all API calls.
- Include credentials for cookie-based auth where required.
- Auth behavior (refresh/retry) must be implemented in one place, not duplicated.
- Auth user state must be kept in global store (e.g. Zustand), not in page-local state.

## 2.6 Forms and Validation

- Use `react-hook-form` for forms.
- Validate payloads with `zod`.
- Validation schemas should be placed in `lib/validation/*`.

## 2.7 State Management

- Use Zustand for app-wide state (auth/session/game if shared).
- Keep store shape minimal and explicit.
- No hidden side effects in components; side effects belong in services/store actions.

## 2.8 Routing and Layout

- Route files are thin.
- Page/layout files should compose components, not contain heavy business logic.
- Route guards and bootstrap logic should be centralized (providers/bootstrap components).

## 2.9 Styling

- Reuse design system components (shadcn/ui) first.
- Avoid inline ad-hoc patterns when a reusable component is appropriate.

---

## 3. Backend Specification (FastAPI / SQLAlchemy)

## 3.1 Layered Architecture by Entity

All layers should be split by entity (user/game/card/etc):

- `enums/<entity>.py`
- `schemas/<entity>.py`
- `repositories/<entity>.py`
- `services/<entity>.py`
- `api/endpoints/<entity>.py`
- `db/models/<entity>.py`

No cross-entity dumping (e.g. avoid mixed giant files).

## 3.2 API Endpoint Rules

- Endpoint handlers should be thin.
- Endpoint should return service method result directly.
- No business logic in endpoints.
- Validate request/response with Pydantic schemas.

## 3.3 Service Rules

- Business logic belongs to services.
- Services orchestrate repositories/unit-of-work.
- Services should not depend on FastAPI request context unless required.

## 3.4 Repository Rules

- Repositories are responsible for DB access only.
- No business decisions inside repositories.
- Keep query logic explicit and testable.

## 3.5 Environment Variables and Config

- All backend envs must be validated via Pydantic settings.
- No raw `os.getenv` in business code.
- Settings must be loaded through centralized config module.

## 3.6 Auth and Security

- JWT access/refresh with clear token types.
- HttpOnly cookies for token transport.
- Passwords must be hashed (never plaintext).
- Auth-related constants (cookie names, TTLs, algorithms) should be centralized.

## 3.7 Database and Migrations

- Every schema change requires Alembic migration.
- Model updates and migration updates must be committed together.
- Relationship ambiguity must be resolved explicitly (`foreign_keys`).
- Prefer explicit indexes for frequent query paths.

## 3.8 Domain Logging

- Game domain events should be persisted in dedicated game-log table/model.
- Logging schema must support replay/debug (`round`, `sequence`, `actor`, `action`, `payload`).

---

## 4. Cross-Cutting Standards

## 4.1 Imports and Dependencies

- Prefer absolute imports from project root alias.
- Avoid circular dependencies.
- Keep dependency surface minimal.

## 4.2 Error Handling

- Raise explicit, user-meaningful errors.
- Do not swallow exceptions silently.
- Ensure API error format is consistent.

## 4.3 Code Clarity

- Use descriptive names (`user_id`, `game_state`, `refresh_token`).
- Avoid one-letter names except tiny loop counters.
- Keep functions small and single-purpose.

## 4.4 Testing (Minimum Policy)

- Backend:
  - unit tests for service rules
  - integration tests for critical endpoints (auth/game turn)
- Frontend:
  - at least smoke tests for auth flow and game flow when test infra is ready

## 4.5 Git and Review Hygiene

- One PR = one coherent concern.
- No unrelated refactors mixed with feature work.
- Update docs/spec when architecture conventions change.

---

## 5. Non-Negotiable Rules (Quick Checklist)

- Frontend filenames/folders are kebab-case.
- Only pages/layouts use default export.
- Functions are declared with `function`, not arrow for declarations.
- One component per file.
- Props interface stays in component file.
- Business types live in `lib/types/<entity>.ts`.
- Env usage only via validated centralized config.
- Backend split by entity across enums/schemas/models/services/endpoints.
- Endpoints return service method results.
- Backend env validated via Pydantic settings.

