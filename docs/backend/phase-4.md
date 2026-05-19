# Phase 4 — Remaining Lead Workflows

**Goal:** All five lead types working end-to-end with Turnstile, validation, Resend, and admin notifications.

**Estimated effort:** 1.5–2 days

**Depends on:** [Phase 3](./phase-3.md)

## Overview

Repeat the Phase 2–3 pattern for each workflow:

1. Email template in `functions/_shared/emailTemplates/`
2. Route in `functions/api/` using `createLeadHandler`
3. `submitX()` in `src/lib/api/leads.ts`
4. Wire existing form (or create new donation form)
5. Add `TurnstileWidget` to each form

See [api-contract.md](./api-contract.md) for payload fields.

---

## 4.1 Volunteer With Us

### Backend

- `functions/_shared/emailTemplates/volunteer.ts`
- `functions/api/volunteer.ts` — subject: `[EYF Volunteer] {name} — {eventTitle}`

### Frontend

- **`src/components/sections/VolunteerRegistrationForm.tsx`**
  - Remove `setTimeout` placeholder
  - Call `submitVolunteer(payload, turnstileToken)`
  - Add `TurnstileWidget`

### Validation highlights

- `agreeToGuidelines` must be `true`
- `eventTitle` must match allowed options from `VOLUNTEER_REGISTRATION_EVENTS` (optional server-side enum)

---

## 4.2 Newsletter Subscription

### Backend

- `functions/_shared/emailTemplates/newsletter.ts`
- `functions/api/newsletter.ts` — subject: `[EYF Newsletter] New subscriber`

### Frontend

- **`src/components/footer/NewsletterSection.tsx`**
  - Add loading + error + success states
  - Add compact `TurnstileWidget` (footer layout — use `size="compact"` if supported)
  - Call `submitNewsletter({ email }, turnstileToken)`

Also used on home page via `HomePage.tsx` — no extra work if component is shared.

---

## 4.3 Donation Cheque Collection Request

### Backend

- `functions/_shared/emailTemplates/donation.ts`
- `functions/api/donation.ts` — subject: `[EYF Donation] Cheque collection — {name}`

### Frontend (new)

**Create `src/components/sections/DonationChequeRequestForm.tsx`**

Suggested fields:

| Field | Input type |
|-------|------------|
| `name` | text |
| `email` | email |
| `phone` | tel |
| `address` | textarea |
| `preferredDate` | text or date |
| `amount` | text (optional) |
| `notes` | textarea (optional) |

**Modify `src/app/donation/page.tsx`**

- Add section below cheque note (replace or supplement mailto-only flow)
- Keep mailto as fallback link

Export form from `src/components/sections/index.ts` if applicable.

---

## 4.4 Request Volunteer Support

### Backend

- `functions/_shared/emailTemplates/support.ts`
- `functions/api/support.ts` — subject: `[EYF Volunteer Support] {name} — {date}`

### Frontend

- **`src/components/sections/VolunteerSupportRequestForm.tsx`**
  - Remove placeholder delay
  - Call `submitSupport`
  - Add `TurnstileWidget`
  - File input: disable in v1 or show note “email files to …” until Phase 5

---

## 4.5 Shared frontend updates

**`src/types/leads.ts`**

Add interfaces:

- `VolunteerPayload`
- `NewsletterPayload`
- `DonationPayload`
- `SupportPayload`

**`src/lib/api/leads.ts`**

- `submitVolunteer`
- `submitNewsletter`
- `submitDonation`
- `submitSupport`

Optional: `src/hooks/useLeadSubmit.ts` for shared loading/error pattern.

---

## Deliverables

| Workflow | API | Template | Form wired |
|----------|-----|----------|------------|
| Contact | done Phase 2–3 | done | done |
| Volunteer | [ ] | [ ] | [ ] |
| Newsletter | [ ] | [ ] | [ ] |
| Donation | [ ] | [ ] | [ ] (new form) |
| Support | [ ] | [ ] | [ ] |

## Acceptance criteria

1. Each of the five forms submits successfully on `pages:dev`
2. Five distinct admin email templates received
3. All routes reject invalid payloads with `400`
4. All routes require valid Turnstile in production config
5. Donation page includes cheque collection form (not mailto-only)

## Testing matrix

| Test | Contact | Volunteer | Newsletter | Donation | Support |
|------|---------|-----------|------------|----------|---------|
| Happy path | ✓ | ✓ | ✓ | ✓ | ✓ |
| Invalid email | ✓ | ✓ | ✓ | ✓ | ✓ |
| Missing required field | ✓ | ✓ | — | ✓ | ✓ |
| Guidelines not agreed | — | ✓ | — | — | — |
| No Turnstile token | ✓ | ✓ | ✓ | ✓ | ✓ |

## Files to create/modify

| Action | Path |
|--------|------|
| Create | `functions/_shared/emailTemplates/volunteer.ts` |
| Create | `functions/_shared/emailTemplates/newsletter.ts` |
| Create | `functions/_shared/emailTemplates/donation.ts` |
| Create | `functions/_shared/emailTemplates/support.ts` |
| Modify | `functions/api/volunteer.ts` |
| Modify | `functions/api/newsletter.ts` |
| Modify | `functions/api/donation.ts` |
| Modify | `functions/api/support.ts` |
| Modify | `src/types/leads.ts` |
| Modify | `src/lib/api/leads.ts` |
| Modify | `VolunteerRegistrationForm.tsx` |
| Modify | `NewsletterSection.tsx` |
| Create | `DonationChequeRequestForm.tsx` |
| Modify | `donation/page.tsx` |
| Modify | `VolunteerSupportRequestForm.tsx` |

## Next phase

[Phase 5 — Production Hardening](./phase-5.md)
