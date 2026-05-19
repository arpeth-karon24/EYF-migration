# Environment Variables

## Overview

| Scope | Where set | Examples |
|-------|-----------|----------|
| Public (client) | `.env.local`, Cloudflare Pages build env | `NEXT_PUBLIC_*` |
| Secret (server) | Cloudflare Pages dashboard, `.dev.vars` | `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` |

Never commit `.env.local` or `.dev.vars`. Keep `env.example` updated without real values.

## Client (public)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | yes | e.g. `https://engage-youth.org` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | prod yes | Turnstile site key for widget |
| `NEXT_PUBLIC_API_BASE_URL` | no | Default `""` for same-origin `/api/*` |

Existing CMS/analytics vars in `env.example` are unrelated to leads but may coexist:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_SANITY_*`
- `NEXT_PUBLIC_SUPABASE_*`

## Server (Cloudflare Pages / Wrangler only)

| Variable | Required | Description |
|----------|----------|-------------|
| `TURNSTILE_SECRET_KEY` | prod yes | Turnstile secret for siteverify |
| `RESEND_API_KEY` | yes | Resend API key |
| `RESEND_FROM_EMAIL` | yes | e.g. `EYF Notifications <notifications@engage-youth.org>` |
| `ADMIN_EMAIL` | yes | Primary inbox for all lead notifications |
| `ADMIN_EMAIL_CC` | no | Optional CC |
| `ALLOWED_ORIGINS` | prod yes | Comma-separated, e.g. `https://engage-youth.org,https://www.engage-youth.org` |

## Example `env.example` additions

```env
# Lead forms (public)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_API_BASE_URL=

# Lead forms (server — Cloudflare only, NOT in Next.js client bundle)
TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=
ADMIN_EMAIL_CC=
ALLOWED_ORIGINS=https://engage-youth.org
```

## Local development with Wrangler

Create `.dev.vars` at the project root (gitignored):

```env
TURNSTILE_SECRET_KEY=your_secret
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=EYF <onboarding@resend.dev>
ADMIN_EMAIL=you@example.com
ALLOWED_ORIGINS=http://localhost:8788,http://127.0.0.1:8788
```

For frontend-only `npm run dev`, set `NEXT_PUBLIC_API_BASE_URL` to your Wrangler dev URL if testing API from port 3000.

## Cloudflare Pages dashboard

1. Project → **Settings** → **Environment variables**
2. Add secrets for **Production** and **Preview**
3. Separate preview values if using Resend test mode or a staging admin inbox

## Resend setup checklist

1. Create Resend account and API key
2. Verify sending domain (`engage-youth.org` or subdomain)
3. Set `RESEND_FROM_EMAIL` to a verified address
4. Test with Resend dashboard before production traffic

## Turnstile setup checklist

1. Cloudflare Dashboard → Turnstile → create widget
2. Add production hostname: `engage-youth.org`
3. Copy site key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
4. Copy secret key → `TURNSTILE_SECRET_KEY` (Cloudflare only)

## Security notes

- Do not prefix server secrets with `NEXT_PUBLIC_`
- Do not import `functions/_shared/resend.ts` into `src/`
- Rotate `RESEND_API_KEY` if exposed
- Lock `ALLOWED_ORIGINS` in production; avoid `*` with credentials
