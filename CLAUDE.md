# CLAUDE.md — AttendanceHub

This file provides guidance for AI assistants working on the AttendanceHub codebase.

## Project Overview

AttendanceHub is an enterprise HR Time & Attendance platform built as a full-stack TypeScript monorepo. It tracks employee time, manages PTO requests, integrates with biometric devices, and produces payroll-ready outputs. The system is multi-tenant with role-based access control and supports English, Arabic, and Hebrew (with RTL layouts).

## Repository Structure

```
attendancehub/
├── client/                    # React 18 SPA (Vite)
│   └── src/
│       ├── components/        # Reusable UI components (shadcn/ui + custom)
│       │   └── ui/            # Base shadcn/ui primitives
│       ├── pages/             # Route-level page components
│       ├── hooks/             # Custom React hooks
│       └── lib/               # Utilities (cn(), query client, i18n, etc.)
├── server/                    # Express.js backend
│   ├── index.ts               # Server entry point, port binding
│   ├── routes.ts              # All API route registrations
│   ├── storage.ts             # Database access layer (Drizzle ORM)
│   └── auth-simple.ts         # Session-based auth & OIDC integration
├── shared/                    # Shared between client and server
│   └── schema.ts              # Drizzle table definitions + Zod schemas
├── migrations/                # Drizzle-generated SQL migration files
├── public/                    # Static assets served directly
├── drizzle.config.ts          # Drizzle Kit configuration
├── vite.config.ts             # Vite bundler config (frontend + proxy)
├── tsconfig.json              # TypeScript config (strict, ESNext)
├── tailwind.config.ts         # Tailwind + custom design tokens
└── components.json            # shadcn/ui CLI configuration
```

## Development Commands

```bash
npm run dev        # Start dev server (tsx, NODE_ENV=development, port 5000)
npm run build      # Build frontend (Vite) + backend (ESBuild) for production
npm run start      # Run production build (NODE_ENV=production)
npm run check      # TypeScript type check (no emit)
npm run db:push    # Push schema changes to DB via Drizzle Kit (no migrations generated)
```

> **Note:** There is no `npm test` script — tests are not yet implemented.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon serverless supported) |
| `SESSION_SECRET` | Yes | Min 32-char string for session encryption |
| `PORT` | No | Defaults to 5000 |

Never hardcode secrets. Never commit `.env` files.

## Technology Stack

### Frontend
- **React 18** + **TypeScript** — component model and type safety
- **Vite** — dev server with HMR and production bundler
- **Wouter** — lightweight client-side routing (not React Router)
- **TanStack React Query v5** — server state, caching, and mutations
- **React Hook Form** + **Zod** — form handling with runtime validation
- **shadcn/ui** (New York style) on **Radix UI** primitives — accessible components
- **Tailwind CSS** — utility-first styling with CSS variable theming
- **Framer Motion** — animations
- **date-fns** — date manipulation
- **Recharts** — charts and analytics visualizations

### Backend
- **Express.js** + **TypeScript** — REST API server
- **Drizzle ORM** — type-safe database queries (no raw SQL)
- **@neondatabase/serverless** — PostgreSQL connection pooling via WebSocket
- **express-session** + **connect-pg-simple** — PostgreSQL-backed sessions
- **Passport.js** + **openid-client** — OIDC authentication
- **Zod** — input validation on all API endpoints
- **ws** — WebSocket support

### Database
- **PostgreSQL** (Neon serverless in production)
- Schema defined in `shared/schema.ts` using Drizzle table builders
- Migrations output to `migrations/` via `drizzle-kit`

## Database Schema (Key Tables)

| Table | Purpose |
|---|---|
| `users` | Auth accounts linked to employees; stores role and tenant |
| `employees` | Employee profiles, contact info, site assignment |
| `punches` | Individual clock-in/out events with location & device data |
| `timesheets` | Aggregated and calculated time periods for review |
| `pto_requests` | Leave requests with approval workflow state |
| `devices` | Biometric/time clock device registry and status |
| `sites` | Organizational locations for multi-site tenancy |
| `managers` | Manager–employee reporting relationships |
| `audit_logs` | Immutable log of all data-modifying actions |

Schema changes: edit `shared/schema.ts`, then run `npm run db:push`.

## API Conventions

- All routes are RESTful JSON over HTTP
- Authentication is session-based; all protected routes check `req.isAuthenticated()`
- Role-based guards enforce: `employee < manager < hr_admin < auditor`
- Tenant isolation is enforced at the storage layer — every query filters by tenant ID
- Validation uses Zod schemas derived from the shared schema (`drizzle-zod`)
- Error responses: generic messages to client, detailed errors logged server-side only

### Route Structure (server/routes.ts)
- `POST /api/auth/login` / `GET /api/auth/logout`
- `GET|POST /api/punches`
- `GET|PUT /api/timesheets/:id`
- `GET|POST|PUT|DELETE /api/employees`
- `GET|POST|PUT /api/pto-requests`
- `GET /api/analytics/dashboard`
- `GET|POST /api/devices`
- `GET /api/audit-logs`

## Code Style and Conventions

### Naming
- `camelCase` — variables, functions, parameters
- `PascalCase` — React components, TypeScript interfaces/types, classes
- `UPPER_SNAKE_CASE` — constants and enum-like values
- `kebab-case` — file names (e.g., `clock-card.tsx`, `use-punch.ts`)

### Formatting
- **2 spaces** indentation
- **Semicolons required**
- Opening braces on the **same line**
- Single quotes for strings (JS/TS), double quotes in JSX attributes

### TypeScript
- Strict mode is enabled — no `any` without justification
- Prefer explicit return types on exported functions
- Use Zod schemas for runtime validation; derive TypeScript types with `z.infer<>`
- Path aliases: `@/*` → `client/src/*`, `@shared/*` → `shared/*`

### React Patterns
- Functional components only (no class components)
- Custom hooks in `client/src/hooks/` prefixed with `use`
- Server state via React Query — avoid local state for server data
- Forms via React Hook Form with Zod resolver
- Use `cn()` from `@/lib/utils` for conditional Tailwind class merging

### Components
- shadcn/ui components live in `client/src/components/ui/` — do not modify these directly; regenerate via CLI if needed
- Business logic components live in `client/src/components/`
- Keep components focused — extract hooks for data-fetching logic

## Security Requirements (Non-Negotiable)

1. **Input validation**: Every API endpoint must validate inputs with Zod before processing
2. **No raw SQL**: Use Drizzle ORM exclusively — parameterized queries only
3. **Tenant isolation**: Every DB query must scope to the authenticated user's tenant
4. **Secret management**: All credentials via environment variables — never hardcode
5. **Error messages**: Return generic errors to clients; log details server-side
6. **Rate limiting**: Auth endpoints must be rate-limited
7. **GDPR/CCPA**: Employee PII must be handled with appropriate access controls and audit trails
8. **Password hashing**: Use bcrypt or Argon2 — never store plaintext

## Development Priority Order

When making any change, prioritize in this order:
1. **Security** — protect user data, validate all inputs, follow secure coding practices
2. **Correctness** — do not break working features; fix bugs only when necessary
3. **Documentation** — JSDoc with `@param`, `@returns`, `@throws`, `@security`, `@compliance`
4. **Maintainability** — style improvements only if no security/correctness conflicts

**Never rewrite working code for style alone.**

## Multi-Language / RTL Support

- Supported locales: `en` (LTR), `ar` (RTL), `he` (RTL)
- Translation keys must be unique — duplicate keys cause console warnings
- RTL layout is applied automatically based on the active locale
- Use `dir="rtl"` and logical CSS properties (`margin-inline-start` vs `margin-left`) where possible

## Authentication

- Development uses simple session-based auth (username/password via `passport-local`)
- Production uses Replit OIDC via `openid-client` and `passport`
- Sessions stored in PostgreSQL (`connect-pg-simple`)
- Test accounts: employee `46581947`, manager `manager-1`, hr-admin `hr-admin-1`

## PWA

The app supports Progressive Web App features:
- Service worker for offline caching
- Install prompts on mobile
- Responsive layout for all screen sizes

When modifying the service worker, test offline behavior explicitly.

## Common Pitfalls

- **`db:push` vs migrations**: `npm run db:push` applies schema directly — suitable for development. For production use `drizzle-kit generate` + `migrate`.
- **Wouter vs React Router**: This project uses Wouter — do not add React Router.
- **shadcn/ui components**: These are copied into the repo and owned by the project. Regenerate via `npx shadcn@latest add <component>` if needed.
- **Session secret length**: `SESSION_SECRET` must be at least 32 characters.
- **Neon WebSocket**: The Neon serverless driver requires a WebSocket global in some environments — handled in `server/index.ts`.

## Deployment

### Replit (primary)
- Configured via `.replit` — runs on port 5000 (mapped to external 80)
- PostgreSQL 16 module is auto-provisioned
- `npm run build` then `npm run start`

### Manual / Other Platforms
```bash
npm install
npm run db:push   # or run migrations
npm run build
npm run start
```

Required environment variables must be set before starting.
