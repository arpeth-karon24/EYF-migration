# Phase 3 — Turnstile + Reusable Validation Middleware

**Goal:** Bot protection and a single handler pipeline reused by all lead routes.

**Estimated effort:** 0.5–1 day

**Depends on:** [Phase 2](./phase-2.md)

## Prerequisites

- Cloudflare Turnstile widget created
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in frontend env
- `TURNSTILE_SECRET_KEY` in `.dev.vars` / Cloudflare Pages secrets

## Tasks

### 3.1 Turnstile verification (`functions/_shared/turnstile.ts`)

```
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
```

Body (form or JSON):

- `secret`: `TURNSTILE_SECRET_KEY`
- `response`: token from client
- `remoteip`: optional, from `CF-Connecting-IP` or `X-Forwarded-For`

Return `{ success: boolean }`. On failure, handler returns `403`.

**Dev bypass (optional, strict):**

- Only when `ENVIRONMENT=development` and token is a documented test value
- Never enable bypass in production

### 3.2 Validation module (`functions/_shared/validation.ts`)

Centralize schemas for all workflows (Zod recommended):

- `contactSchema`
- `volunteerSchema`
- `newsletterSchema`
- `donationSchema`
- `supportSchema`

Export:

```ts
validate<T>(schema, data): { ok: true, data: T } | { ok: false, fields }
```

### 3.3 Handler factory (`functions/_shared/handler.ts`)

```ts
createLeadHandler<T>({
  schema,
  subject: (data: T) => string,
  renderEmail: (data: T) => { html: string; text?: string },
}): PagesFunction
```

Pipeline order:

1. CORS / OPTIONS
2. Method check
3. Parse JSON (`turnstileToken`, `payload`)
4. Verify Turnstile
5. Validate payload
6. Send email via Resend
7. Success response

### 3.4 Refactor `contact.ts`

Replace inline logic with `createLeadHandler` + `contactSchema` + `renderContactEmail`.

### 3.5 Frontend Turnstile widget

Install:

```bash
npm install @marsidev/react-turnstile
```

**`src/components/ui/TurnstileWidget.tsx`**

- Renders widget when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
- Exposes token via callback ref or `onSuccess(token)`
- `reset()` after successful submit

Replace usages of `TurnstileSlot` in:

- `ContactForm`
- (prepare pattern for Phase 4 forms)

### 3.6 Update API client

**`src/lib/api/leads.ts`**

- `turnstileToken` required in production paths
- Type: `submitContact(payload, turnstileToken: string)`

### 3.7 Block submit without token

In each form:

- Disable submit until Turnstile succeeds (when site key configured)
- Show helper text if widget fails to load

## Deliverables

- [ ] `functions/_shared/turnstile.ts`
- [ ] `functions/_shared/handler.ts`
- [ ] `functions/_shared/validation.ts` with all schemas defined (used by contact first)
- [ ] `contact.ts` refactored to factory
- [ ] `TurnstileWidget.tsx` replaces `TurnstileSlot`
- [ ] Contact form sends `turnstileToken`

## Acceptance criteria

1. Submit without token → `403`
2. Submit with invalid token → `403`
3. Submit with valid token + valid body → `200` + email sent
4. Widget resets after success
5. No Turnstile secret in client bundle

## Testing checklist

- [ ] Production-like flow with real Turnstile keys
- [ ] Missing `turnstileToken` in JSON body
- [ ] Expired token (submit twice without reset)
- [ ] CORS preflight from allowed origin

## Files to create/modify

| Action | Path |
|--------|------|
| Create | `functions/_shared/turnstile.ts` |
| Create | `functions/_shared/handler.ts` |
| Modify | `functions/_shared/validation.ts` |
| Modify | `functions/api/contact.ts` |
| Create | `src/components/ui/TurnstileWidget.tsx` |
| Modify | `src/components/sections/ContactForm.tsx` |
| Modify | `src/lib/api/leads.ts` |
| Modify | `src/components/index.ts` (export widget) |
| Modify | `package.json` (turnstile dependency) |
| Deprecate/remove | `TurnstileSlot.tsx` when fully replaced |

## Next phase

[Phase 4 — Remaining Workflows](./phase-4.md)
