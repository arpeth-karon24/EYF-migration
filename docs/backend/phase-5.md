# Phase 5 — Production Hardening

**Goal:** Polished emails, consistent UX, security, observability, and production deployment checklist.

**Estimated effort:** 1 day

**Depends on:** [Phase 4](./phase-4.md)

## 5.1 Email templates (polish)

### Layout improvements

- Mobile-responsive tables (max-width 600px)
- EYF branding: logo URL, gold accent `#c9a227` (or project token)
- Consistent typography (system fonts safe for email)
- Footer: org name, site link, privacy note

### Per-template content

Each template should include:

- Submission timestamp (UTC + local hint)
- All form fields as labeled rows
- “Reply to submitter” mailto link using submitter email where appropriate

### Plain-text parts

Every Resend send includes `text` alternative generated from the same data (accessibility + deliverability).

### Optional auto-reply (config flag)

| Env flag | Behavior |
|----------|----------|
| `SEND_USER_CONFIRMATION=true` | Second email to submitter: “We received your message” |

Per-workflow copy in `functions/_shared/emailTemplates/autoReply.ts`.

---

## 5.2 Error handling

### Server

- Log Resend/Turnstile errors with `console.error` (Cloudflare dashboard logs)
- Never expose upstream error bodies to client
- Map known failures:
  - Resend 422 → validation logged, generic `500` to client
  - Turnstile timeout → `403` with retry message

### Client

- Consistent error banner styling across all forms
- Network failure message: “Check your connection and try again”
- Parse `fields` from `400` for inline errors (optional enhancement)

---

## 5.3 Security

### CORS

- Production: `ALLOWED_ORIGINS` exact match only
- No `*` when cookies or sensitive headers used

### Honeypot

Add hidden field `website` to forms:

- If non-empty → silently return fake `200` or `400` (document choice)
- Bots often fill hidden fields

### Headers (optional `functions/_middleware.ts`)

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Rate limiting

**Option A (recommended):** Cloudflare dashboard → Security → WAF rate limiting rules on `/api/*`

**Option B:** Workers KV token bucket (only if dashboard rules insufficient)

### Input sanitization

- HTML-escape all user content in email templates
- Enforce max lengths on all string fields
- Strip control characters from text fields

---

## 5.4 File attachments (v2 / optional)

If required for Contact and Volunteer Support forms:

| Constraint | Value |
|------------|-------|
| Max size | ~1 MB per file |
| Types | pdf, jpg, png only |
| Transport | base64 in JSON (consider multipart later) |
| Resend | `attachments: [{ filename, content }]` |

**Alternative for v1:** Keep file inputs disabled; show: “To attach files, email engageyouthfoundation@gmail.com”

---

## 5.5 Loading states and UX

Standardize across forms:

- Submit button: disabled + “Sending…” / “Submitting…”
- Prevent double-submit (disable until response or error)
- Reset Turnstile on success
- Success message auto-dismiss optional (not required)

---

## 5.6 Monitoring and operations

| Tool | Use |
|------|-----|
| Resend dashboard | Delivery, bounces, failures |
| Cloudflare Pages → Functions | Invocation errors, latency |
| Optional Slack | Duplicate notify via `SLACK_WEBHOOK_URL` |

### Alerting (manual checklist)

- [ ] Resend domain verified
- [ ] Admin inbox monitored
- [ ] Test submission after each deploy

---

## 5.7 Deployment checklist

### Cloudflare Pages

- [ ] Build command: `npm run build`
- [ ] Output directory: `out`
- [ ] Functions directory: `/functions` (auto)
- [ ] Production env vars set (see [environment-variables.md](./environment-variables.md))
- [ ] Preview env vars for staging

### DNS / domain

- [ ] `engage-youth.org` on Cloudflare Pages
- [ ] HTTPS enforced

### Pre-launch tests (production)

- [ ] Contact form
- [ ] Volunteer registration
- [ ] Newsletter (footer + home)
- [ ] Donation cheque request
- [ ] Volunteer support request
- [ ] Turnstile on production hostname
- [ ] Email arrives within 60 seconds
- [ ] Spam folder check / SPF/DKIM via Resend

### Rollback

- Redeploy previous Pages deployment from dashboard if API regression

---

## 5.8 Cleanup and tech debt

| Item | Action |
|------|--------|
| `TurnstileSlot.tsx` | Remove if fully replaced |
| Supabase on lead paths | Ensure forms do not call Supabase |
| `ContactForm` subject field | Add UI or remove from state |
| `wrangler.toml` service binding comments | Update if separate Worker added later |
| `env.example` | Final sync with all vars |

---

## Deliverables

- [ ] Polished HTML + plain-text emails for all 5 workflows
- [ ] Honeypot on all public forms
- [ ] CORS locked to production domains
- [ ] Rate limiting configured
- [ ] Consistent form UX (loading, errors, Turnstile reset)
- [ ] Production deployment checklist completed
- [ ] Optional: user confirmation emails
- [ ] Optional: file attachments
- [ ] Optional: Slack duplicate notifications

## Acceptance criteria

1. Production smoke test: all five forms succeed with real Turnstile + Resend
2. Security scan basics: no secrets in `out/` JS bundles
3. Invalid/bot traffic does not flood admin inbox (Turnstile + rate limit)
4. Emails render correctly on mobile Gmail and Outlook

## Post-launch (future, out of scope)

- Sanity CMS integration for content
- Admin dashboard (if ever needed — still email-first)
- Analytics events on successful submit (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)

## Related docs

- [README](./README.md)
- [architecture.md](./architecture.md)
- [api-contract.md](./api-contract.md)
- [environment-variables.md](./environment-variables.md)
