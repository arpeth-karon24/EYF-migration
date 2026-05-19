# Phase 2 — Contact Us + Resend + Admin Notifications

**Goal:** First complete end-to-end lead workflow: Contact form → API → admin email.

**Estimated effort:** 1 day

**Depends on:** [Phase 1](./phase-1.md)

## Prerequisites

- Resend account + API key
- Verified sender domain (or use Resend sandbox `onboarding@resend.dev` for dev)
- `.dev.vars` with `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`

## Tasks

### 2.1 Resend client (`functions/_shared/resend.ts`)

Use Workers-compatible `fetch`:

```
POST https://api.resend.com/emails
Authorization: Bearer {RESEND_API_KEY}
```

Payload:

- `from`, `to`, `subject`
- `html` (required for v1)
- `text` (optional plain-text fallback — full text in Phase 5)

Export:

```ts
sendAdminEmail({ subject, html, text? }): Promise<void>
```

Throw typed errors for non-2xx; map to safe client messages in the handler.

### 2.2 Email templates (minimal)

**`functions/_shared/emailTemplates/layout.ts`**

- Responsive table-based HTML
- EYF header, footer, timestamp, reply-to hint

**`functions/_shared/emailTemplates/contact.ts`**

- `renderContactEmail(data: ContactPayload): { html, text }`
- Escape user content for HTML injection

### 2.3 Contact validation

In `functions/_shared/validation.ts` (or inline until Phase 3):

- `name`: required, max 120
- `email`: required, valid format
- `message`: required, max 5000
- `subject`: optional

Return field-level errors for `400` responses.

### 2.4 Implement `functions/api/contact.ts`

Pipeline (Turnstile skipped or optional in dev until Phase 3):

1. `OPTIONS` → CORS
2. `POST` only
3. Parse JSON `{ payload }` (add `turnstileToken` in Phase 3)
4. Validate payload
5. Render email
6. `sendAdminEmail`
7. Return `{ ok: true, message }`

### 2.5 Frontend types and API client

**`src/types/leads.ts`**

```ts
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
}
```

**`src/lib/api/leads.ts`**

- `getApiBase()` from `NEXT_PUBLIC_API_BASE_URL`
- `submitContact(payload, turnstileToken?)`
- `handleApiResponse(res)` — parse JSON, throw on `!ok`

### 2.6 Wire `ContactForm`

- Replace optional `onSubmit` stub with `submitContact`
- Map API errors to `message` state
- Keep existing loading UI

**`src/app/contact-us/page.tsx`**

- No change required if `ContactForm` calls API internally

### 2.7 Update `env.example`

Add Resend and admin variables (see [environment-variables.md](./environment-variables.md)).

## Deliverables

- [ ] `functions/_shared/resend.ts`
- [ ] `functions/_shared/emailTemplates/layout.ts`
- [ ] `functions/_shared/emailTemplates/contact.ts`
- [ ] `functions/api/contact.ts` sends real email
- [ ] `src/types/leads.ts`
- [ ] `src/lib/api/leads.ts`
- [ ] `ContactForm` calls API
- [ ] `env.example` updated

## Acceptance criteria

1. Submit contact form via `npm run pages:dev`
2. Admin inbox receives formatted HTML email
3. Invalid email → `400` with clear message
4. Success → form resets and shows success banner
5. No `RESEND_API_KEY` in client bundle (verify build output)

## Known gaps (address later)

| Item | Phase |
|------|-------|
| Turnstile enforcement | Phase 3 |
| File upload on contact form | Phase 5 or v2 |
| Contact `subject` field in UI | Phase 4 or fix in Phase 2 |
| User auto-reply email | Phase 5 |

## Testing checklist

- [ ] Valid submission
- [ ] Missing `email`
- [ ] Empty `message`
- [ ] Resend API failure (wrong key) → generic `500` to client
- [ ] Production `RESEND_FROM_EMAIL` uses verified domain

## Files to create/modify

| Action | Path |
|--------|------|
| Create | `functions/_shared/resend.ts` |
| Create | `functions/_shared/validation.ts` (contact schema) |
| Create | `functions/_shared/emailTemplates/layout.ts` |
| Create | `functions/_shared/emailTemplates/contact.ts` |
| Modify | `functions/api/contact.ts` |
| Create | `src/types/leads.ts` |
| Create | `src/lib/api/leads.ts` |
| Modify | `src/components/sections/ContactForm.tsx` |
| Modify | `env.example` |

## Next phase

[Phase 3 — Turnstile + Validation Middleware](./phase-3.md)
