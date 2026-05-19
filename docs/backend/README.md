# EYF Backend / Serverless Implementation

Email-based lead management for [Engage Youth Foundation](https://engage-youth.org). No traditional backend server. No database storage for leads.

## Architecture

```
Frontend Forms
      ↓
Cloudflare Pages Functions (/functions/api/*)
      ↓
Cloudflare Turnstile Validation
      ↓
Resend Email API
      ↓
Admin Email Notifications
```

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js App Router, TypeScript, Tailwind CSS (static export) |
| API | Cloudflare Pages Functions |
| Email | Resend |
| Security | Cloudflare Turnstile |
| Hosting | Cloudflare Pages |
| CMS (later) | Sanity CMS |

## What we do not use

- Express.js or Node backend servers
- MongoDB, PostgreSQL, Firebase, Prisma
- Next.js API routes (static export only)

## Lead workflows

| # | Workflow | API route | Status (frontend) |
|---|----------|-----------|-------------------|
| 1 | Contact Us | `POST /api/contact` | Form exists — stub submit |
| 2 | Volunteer With Us | `POST /api/volunteer` | Form exists — stub submit |
| 3 | Newsletter Subscription | `POST /api/newsletter` | UI exists — `console.log` only |
| 4 | Donation Cheque Collection | `POST /api/donation` | **Form not built yet** (mailto only) |
| 5 | Request Volunteer Support | `POST /api/support` | Form exists — stub submit |

## Documentation index

| Document | Description |
|----------|-------------|
| [architecture.md](./architecture.md) | Folder structure, client vs server split, request flow |
| [api-contract.md](./api-contract.md) | Request/response shapes and payload fields |
| [environment-variables.md](./environment-variables.md) | Env vars for client and Cloudflare |
| [phase-1.md](./phase-1.md) | Cloudflare Pages Functions foundation |
| [phase-2.md](./phase-2.md) | Contact Us + Resend + admin email |
| [phase-3.md](./phase-3.md) | Turnstile + reusable validation middleware |
| [phase-4.md](./phase-4.md) | Remaining four workflows |
| [phase-5.md](./phase-5.md) | Email templates polish, hardening, production |

## Implementation order

Execute phases **sequentially**. Start minimal email templates in Phase 2; polish in Phase 5.

1. [Phase 1](./phase-1.md) — Functions setup, stubs, Wrangler alignment  
2. [Phase 2](./phase-2.md) — Contact + Resend (first live workflow)  
3. [Phase 3](./phase-3.md) — Turnstile + shared handler pipeline  
4. [Phase 4](./phase-4.md) — Volunteer, newsletter, donation, support  
5. [Phase 5](./phase-5.md) — Templates, security, rate limits, deploy checklist  

## Estimated effort

| Phase | Duration |
|-------|----------|
| 1 | 0.5–1 day |
| 2 | 1 day |
| 3 | 0.5–1 day |
| 4 | 1.5–2 days |
| 5 | 1 day |

## Local development

```bash
# Frontend only (API calls will fail unless proxied)
npm run dev

# Full stack: static build + Pages Functions
npm run build && wrangler pages dev out
```

Use `.dev.vars` in the project root for Wrangler-local secrets (see [environment-variables.md](./environment-variables.md)).

## Decisions to confirm before Phase 2

1. **File attachments** — defer to Phase 5 or v2 (Resend + Worker size limits); v1 may be email-only for attachments.  
2. **Contact `subject` field** — present in component state but not in UI; add field or drop from schema.  
3. **Supabase** — not used for lead storage; keep separate for future admin/CMS if needed.  
4. **Resend domain** — verify `engage-youth.org` (or chosen subdomain) before production sends.

## Current repo baseline

- `next.config.ts`: `output: "export"` → build output is `out/`
- `wrangler.toml`: currently points to `.vercel/output/static` — **align to `out` in Phase 1**
- `functions/`: does not exist yet
- `TurnstileSlot.tsx`: placeholder widget
- No Resend integration yet
