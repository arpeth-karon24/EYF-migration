# Phase 1 — Cloudflare Pages Functions Foundation

**Goal:** Deployable serverless skeleton, local dev works, build output aligned with static export.

**Estimated effort:** 0.5–1 day

## Prerequisites

- Cloudflare account with Pages project (or plan to create one)
- `wrangler` installed (already in `devDependencies`)
- `npm run build` produces `out/` directory

## Tasks

### 1.1 Create `functions/` tree

```
functions/
├── _shared/
│   ├── cors.ts
│   ├── response.ts
│   └── env.ts
└── api/
    ├── contact.ts
    ├── volunteer.ts
    ├── newsletter.ts
    ├── donation.ts
    └── support.ts
```

### 1.2 Shared utilities (minimal)

**`response.ts`**

- `jsonResponse(data, status, headers?)`
- `jsonSuccess(message, status = 200)`
- `jsonError(error, message, status, fields?)`

**`cors.ts`**

- `handleOptions(request)` for `OPTIONS`
- `corsHeaders(origin)` using `ALLOWED_ORIGINS` or permissive in dev

**`env.ts`**

- `getEnv(key): string` with clear error if missing in production

### 1.3 Stub API routes

Each `functions/api/*.ts` exports `onRequest` (or `onRequestPost`) that:

- Handles `OPTIONS` → 204 with CORS
- Rejects non-`POST` → `405`
- Returns `501` or `{ ok: false, message: "Not implemented" }` until Phase 2+

Example health check for contact:

```ts
// GET not required; POST stub only for Phase 1
```

### 1.4 Fix `wrangler.toml`

Change:

```toml
pages_build_output_dir = ".vercel/output/static"
```

To:

```toml
pages_build_output_dir = "out"
```

Keep `compatibility_date` current.

### 1.5 npm scripts

Add to `package.json`:

```json
{
  "scripts": {
    "pages:dev": "npm run build && wrangler pages dev out",
    "pages:deploy": "npm run build && wrangler pages deploy out"
  }
}
```

### 1.6 Gitignore

Ensure `.dev.vars` is gitignored (for Phase 2+ local secrets).

## Deliverables

- [ ] `functions/_shared/` with cors + response + env helpers
- [ ] Five stub routes under `functions/api/`
- [ ] `wrangler.toml` points to `out`
- [ ] `pages:dev` and `pages:deploy` scripts
- [ ] `.dev.vars` documented in [environment-variables.md](./environment-variables.md)

## Acceptance criteria

1. `npm run build` succeeds and creates `out/`
2. `npm run pages:dev` serves the static site
3. `curl -X POST http://localhost:8788/api/contact` returns JSON (stub/error), not 404
4. `curl -X OPTIONS http://localhost:8788/api/contact` returns CORS headers

## Out of scope (later phases)

- Resend
- Turnstile verification
- Real validation schemas
- Frontend form wiring

## Files to create/modify

| Action | Path |
|--------|------|
| Create | `functions/_shared/cors.ts` |
| Create | `functions/_shared/response.ts` |
| Create | `functions/_shared/env.ts` |
| Create | `functions/api/contact.ts` |
| Create | `functions/api/volunteer.ts` |
| Create | `functions/api/newsletter.ts` |
| Create | `functions/api/donation.ts` |
| Create | `functions/api/support.ts` |
| Modify | `wrangler.toml` |
| Modify | `package.json` |
| Modify | `.gitignore` (if needed for `.dev.vars`) |

## Next phase

[Phase 2 — Contact Us + Resend](./phase-2.md)
