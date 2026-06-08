<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Perko — loyalty/stamp card SaaS

## Tech stack
- **Next.js 16.2.6** (read `node_modules/next/dist/docs/` before writing code), **React 19.2.4**, **Tailwind v4**, **shadcn/ui** (radix-nova style), **TypeScript 5**
- **Supabase** as Postgres DB only (no Supabase Auth). `@supabase/ssr` for server/browser clients, `@supabase/supabase-js` (service role key) for admin DB ops.
- `motion` for animations, `jose` + `bcrypt` for custom auth, `lucide-react` for icons, `qrcode.react` for QR codes.

## Commands
| Command | What |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production |
| `npm run lint` | ESLint (config in `eslint.config.mjs`) |
| `npx tsc --noEmit` | Type-check (no script in package.json) |

No test framework is configured.

## Auth — custom JWT, not Supabase Auth
- Passwords hashed with `bcrypt`, stored in `profiles.custom_password_hash`.
- Session: HTTP-only `perko_session` cookie (JWT signed with `jose` using `JWT_SECRET` env var).
- Auth API routes in `app/api/auth/`: `login`, `register`, `logout`, `session`, `verify`.
- Middleware (`middleware.ts`) reads the cookie and verifies the JWT to protect routes.
- Client-side `AuthContext` fetches `/api/auth/session` to hydrate the user.
- Signup role stored in client cookie `perko_signup_role` (max-age 600s).

## Route groups & directory layout
- `(auth)` — login, register, verify-email, callback — `components/` (AuthDivider, AuthPageShell, FormField, GoogleAuthButton, PasswordField, PrimaryAuthButton, RegisterForm)
- `(admin)` — `dashboard/` (AdminView, BaristaScannerView, KPIs, charts, QR modal), `onboarding/` (multi-phase wizard with `phases/`)
- `(customer)` — `cartera/` (wallet with StampCard, WalletShowcase), `join/[slug]` (QR redirect handler), `profile/`
- `actions/` (at `app/actions/`) — Server Actions: `auth.ts`, `business.ts`, `dashboard.ts`, `onboarding.ts`, `scan.ts`, `wallet.ts`
- `app/api/auth/` — REST API routes (currently only `verify`)
- `app/context/` — `AuthContext.tsx` (client-side auth)
- `hooks/` — `useDashboardCardEditor.ts`, `useOnboarding.ts`
- `lib/` — third-party clients & utilities (`supabase/`, `server/`, `email.ts`, `env.d.ts`, `utils.ts`)
- `components/ui/` — shadcn/ui primitives (`button.tsx`, `highlighter.tsx`, `marquee.tsx`)
- `components/landingPage/` — 9 landing page sections
- `components/StampPreviewCard.tsx` — standalone shared component
- Path alias: `@/*` maps to repo root

## Tailwind v4
Uses `@import "tailwindcss"` (not `@tailwind` directives). CSS vars via `@theme inline {}`. Config in `postcss.config.mjs` with `@tailwindcss/postcss`.

## Supabase DB tables used
`profiles`, `businesses`, `business_rewards_programs`, `business_points_programs`, `loyalty_cards`, `customer_rewards_balances`, `customer_points_balances`. All queries use service role key (`SUPABASE_SERVICE_ROLE_KEY` env var). No Row-Level Security (RLS) — auth is handled at the app layer.

## Notable
- No CI/CD, no pre-commit hooks, no formatter config.
- ESLint extends `eslint-config-next/core-web-vitals` + `typescript`.
- Project is a single Next.js app (not a monorepo).
- Both `pnpm-lock.yaml` and `package-lock.json` exist.
