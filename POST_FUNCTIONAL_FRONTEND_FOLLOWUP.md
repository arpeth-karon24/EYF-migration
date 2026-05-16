# Post–Functional Implementation: Frontend Follow-Up Checklist

Use this document after backend/API/CMS work is done. It lists every frontend parity item, polish fix, and wiring task identified when comparing this Next.js site to [engage-youth.org](https://engage-youth.org/).

**How to use:** Check off items as you complete them. Items are grouped by when they are easiest to finish (some can be done before backend; others depend on APIs or CMS).

---

## Already complete (no action needed unless regressing)

- [x] Home page: 3-slide hero carousel, stats section, about preview + “Read more”, event filter UI, four key activity blocks
- [x] Primary navigation: About us, How to help, Projects, Volunteer with us CTA
- [x] About page: copy, Mission & Vision (`#vision`), Our Evolution, Board of Directors, Advisory Board
- [x] Team page (`/team`)
- [x] Donation page (`/donation`): intro, in-kind donations, Amazon wishlist, donation guidelines
- [x] Volunteer with us (`/volunteer-with-us`): guidelines, spotlights, **inline registration modal** (Google Form removed)
- [x] Request volunteer support (`/request-for-volunteer`): inline form on page
- [x] FAQ page: 10 accordion items, first item expanded by default
- [x] Contact page: form UI with file upload field
- [x] Events page (`/events`): filter UI, empty state, past events section
- [x] News and Social Media: post grid, individual post pages, sidebar (Recent Posts, Archives, Categories)
- [x] Privacy Policy and Terms pages
- [x] URL redirects: `/donate` → `/donation`, `/blog` → `/news-and-social-media`, `/activities` and `/past-events` → `/events`
- [x] Google Analytics component in root layout

---

## Section A — Frontend fixes (can do before or right after backend)

These do not require a full CMS; some are copy/config only.

### A1. Footer newsletter + honeypot (live site parity)

**Live site:** Newsletter signup lives in the **footer** (global on every page), with a honeypot field: *“Leave this field empty if you're human.”*

**Current site:** Newsletter exists only on the **homepage** (`NewsletterSection`). `SiteFooter` has no signup and no honeypot.

- [ ] Move or duplicate newsletter UI into `SiteFooter` (or layout) so it appears site-wide
- [ ] Add honeypot input (hidden from users, empty on submit)
- [ ] Remove duplicate homepage newsletter if footer version is global (or keep both only if intentional)
- [ ] Match live placeholder/copy: “Sign up to newsletter” / Subscribe button

**Files likely involved:** `src/components/footer/SiteFooter.tsx`, `src/components/footer/NewsletterSection.tsx`, `src/sections/home/HomePage.tsx`, `src/app/layout.tsx`

---

### A2. Broken navigation anchor: Teams → `#board`

**Issue:** Nav links to `/about-us#board` (`src/constants/navigation.ts`) but no element has `id="board"`.

- [ ] Add `id="board"` to the Board of Directors section on the about page (e.g. on `TeamGrid` or a wrapper)
- [ ] Ensure `scroll-mt-*` accounts for sticky header (see Mission & Vision `id="vision"` pattern)

**Files likely involved:** `src/app/about-us/page.tsx`, `src/components/sections/TeamGrid.tsx`

---

### A3. Homepage stats counters — match live values

**Live site:** Displays **0** for Number of Events, Volunteer Number, Volunteer Hours.

**Current site:** `HOME_STATS` in `src/constants/homeContent.ts` animates to **1**, **2**, and **10**.

- [ ] Set counter targets to `0` for visual parity until dynamic data exists
- [ ] After backend: wire `StatCounters` to API/CMS values instead of hardcoded constants

**Files likely involved:** `src/constants/homeContent.ts`, `src/components/cards/StatCounters.tsx`

---

### A4. Social media URLs (placeholders)

**Issue:** Footer uses generic URLs (`https://facebook.com`, `https://linkedin.com`, etc.).

- [ ] Replace with real Engage Youth Foundation profile URLs from the live site
- [ ] Verify icons and `aria-label`s stay correct

**Files likely involved:** `src/components/footer/SiteFooter.tsx`

---

### A5. Skip to content link (accessibility)

**Live site:** “Skip to content” link at top of page.

**Current site:** `main` has `id="content"` in layout but no skip link.

- [ ] Add visually hidden skip link in `src/app/layout.tsx` targeting `#content`
- [ ] Style focus state so keyboard users see it on Tab

**Files likely involved:** `src/app/layout.tsx`, optionally `src/app/globals.css`

---

### A6. Contact form — subject field and styling

**Issues:**

1. `ContactForm` state includes `subject` but the field is **not rendered** in the UI.
2. Inputs use **light** theme (`#f9f9f9`) on a **dark** internal page; volunteer/request forms use dark inputs.

- [ ] Add subject input to the form **or** remove `subject` from state/submit payload
- [ ] Align contact form input styles with other dark forms (`VolunteerSupportRequestForm` / `VolunteerRegistrationForm`)

**Files likely involved:** `src/components/sections/ContactForm.tsx`, `src/app/contact-us/page.tsx`

---

### A7. Volunteer registration — event dropdown labels

**Issue:** Dropdown still uses generic labels from the old Google Form: Event 1, Event 2, Event 3, Event 4.

- [ ] Update `VOLUNTEER_REGISTRATION_EVENTS` in `src/constants/volunteerRegistration.ts` with real event names from your program team
- [ ] Keep “General volunteering” option if still needed

**Files likely involved:** `src/constants/volunteerRegistration.ts`

---

### A8. Event filter UI — non-interactive controls

**Current behavior:**

- Home: date field is `readOnly` (“Select Date Range”)
- Events page: “Any dates” is a button with no date picker
- Filters do not query or filter anything (always shows “no events” — same empty state as live site today)

- [ ] Implement date range picker (home + events page) or disable controls with clear “coming soon” copy
- [ ] Unify home vs events filter UX (styling differs today)
- [ ] After events API exists: wire keywords, location, dates, category, type to search/filter

**Files likely involved:** `src/sections/home/HomeEventsSection.tsx`, `src/app/events/page.tsx`, `src/constants/eventFilters.ts`

---

### A9. News sidebar — archives and categories

**Issue:** Archive and category links all go to `/news-and-social-media` with **no** query params or filtering.

- [ ] After CMS/API: link to `/news-and-social-media?category=...` or dedicated routes
- [ ] Filter post list on listing page by archive date or category
- [ ] Update `ARCHIVES` and `CATEGORIES` in `src/constants/blogContent.ts` or fetch from CMS

**Files likely involved:** `src/app/news-and-social-media/page.tsx`, `src/constants/blogContent.ts`

---

### A10. Sitemap vs redirects for legacy URLs

**Issue:** `src/app/sitemap.ts` lists `/activities/` and `/past-events/`, but `public/_redirects` sends those to `/events/`.

- [ ] Remove `/activities/` and `/past-events/` from sitemap **or** implement real pages
- [ ] Confirm redirects work on your host (Netlify/Cloudflare/Vercel)

**Files likely involved:** `src/app/sitemap.ts`, `public/_redirects`

---

### A11. Scaffold fallback route `[slug]`

**Issue:** `src/app/[slug]/page.tsx` still shows migration scaffold text for `activities` and `past-events` if visited without redirect.

- [ ] Remove slug entries once redirects are guaranteed everywhere **or** replace with proper redirects in `next.config`
- [ ] Delete scaffold page content when no longer needed

**Files likely involved:** `src/app/[slug]/page.tsx`, `next.config.ts` / `next.config.js`

---

### A12. Optional frontend enhancements (not on live site but in internal checklist)

- [ ] **Individual team member pages** (`/team/[slug]` or similar) — currently grid only, no detail routes
- [ ] **Featured hero** on news listing page — checklist mentioned it; current page goes straight to card grid
- [ ] **Terms link in footer** — live site only shows Privacy Policy + Contact us; `/terms` exists but is not linked in footer (add only if desired)

---

## Section B — Wire up after functional / backend implementation

Complete these when API routes, CMS, email, and third-party services exist.

### B1. Form submissions (all forms use placeholders today)

Each form currently simulates success (`setTimeout` / `console.log`). Replace with real handlers.

| Form | Location | Current behavior |
|------|----------|------------------|
| Contact | `src/components/sections/ContactForm.tsx` | Placeholder success; optional `onSubmit` prop unused on contact page |
| Volunteer registration | `src/components/sections/VolunteerRegistrationForm.tsx` | Placeholder; builds `FormData` but does not POST |
| Request volunteer support | `src/components/sections/VolunteerSupportRequestForm.tsx` | Placeholder; includes optional file upload |
| Newsletter | `src/components/footer/NewsletterSection.tsx` | `console.log` only |

- [ ] Create API route(s) or Server Actions per form (e.g. `/api/contact`, `/api/volunteer-register`, `/api/volunteer-request`, `/api/newsletter`)
- [ ] Connect each form `handleSubmit` to POST with error handling and user-facing messages
- [ ] Persist to database (Supabase) and/or send email / Slack (`src/services/slack.ts` exists)
- [ ] Handle file uploads (contact + volunteer request) — storage (e.g. Cloudinary: `src/lib/cloudinary.ts`)
- [ ] Validate server-side (required fields, email format, file size/type)
- [ ] Rate limiting and spam protection (see B2)

---

### B2. Cloudflare Turnstile (spam protection)

**Current:** `src/components/ui/TurnstileSlot.tsx` is a placeholder when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.

- [ ] Install and mount real Turnstile widget (e.g. `@marsidev/react-turnstile`)
- [ ] Add `TurnstileSlot` to: Contact, Volunteer registration, Request volunteer support, Newsletter (footer)
- [ ] Verify token on server before accepting submission
- [ ] Document env vars: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

---

### B3. Newsletter provider

- [ ] Integrate Mailchimp, Buttondown, or similar (mentioned in `IMPLEMENTATION_CHECKLIST.md`)
- [ ] Server-side subscribe endpoint
- [ ] Honeypot validation: reject if honeypot field is filled
- [ ] Success/error UI in footer (and homepage if kept)
- [ ] Double opt-in if required by provider

---

### B4. Events system

- [ ] Event model in CMS or database
- [ ] List upcoming/ongoing events on home and `/events`
- [ ] Filter by keywords, location, date range, category, event type
- [ ] Empty state only when there truly are no events
- [ ] Past events section populated from “past” events or separate content type
- [ ] Optional: link volunteer registration “Event title” dropdown to real events (replaces Event 1–4)

**Files likely involved:** `src/app/events/page.tsx`, `src/sections/home/HomeEventsSection.tsx`, `src/constants/eventFilters.ts`, `src/constants/volunteerRegistration.ts`

---

### B5. Dynamic stats counters

- [ ] API or CMS fields for: Number of Events, Volunteer Number, Volunteer Hours
- [ ] Fetch on home page (server component or client fetch)
- [ ] Pass real `to` values into `StatCounters` instead of `HOME_STATS` constants
- [ ] Handle loading and fallback (e.g. show 0 while loading)

**Files likely involved:** `src/constants/homeContent.ts`, `src/components/cards/StatCounters.tsx`, `src/sections/home/HomePage.tsx`

---

### B6. Blog / News from CMS

**Current:** Static content in `src/constants/blogContent.ts`. Sanity client exists at `src/sanity/client.ts` but is not used for pages.

- [ ] Import posts from Sanity (or chosen CMS)
- [ ] `generateStaticParams` / ISR for `/news-and-social-media/[slug]`
- [ ] Dynamic Recent Posts, Archives, Categories sidebars
- [ ] Optional: social share buttons on post detail (mentioned in checklist)
- [ ] Keep or update `public/_redirects` for old WordPress post URLs

**Files likely involved:** `src/constants/blogContent.ts`, `src/app/news-and-social-media/page.tsx`, `src/app/news-and-social-media/[slug]/page.tsx`, `src/sanity/client.ts`

---

### B7. Admin dashboard

**Current:** `src/app/admin/page.tsx` is a shell; Supabase clients in `src/supabase/server.ts` and `src/supabase/browser.ts`.

- [ ] Auth middleware protecting `/admin`
- [ ] Wire `createSupabaseServerClient()` for session
- [ ] UI to view/export form submissions, manage events, edit stats, moderate content
- [ ] `robots: noindex` already set — keep for production

---

### B8. Donations

**Live site:** Cheque / contact email; no online payment.

- [ ] Confirm whether online giving (Stripe/PayPal) is in scope
- [ ] If yes: donation flow + receipts; if no: document mail/cheque-only parity as complete
- [ ] Ensure donation contact email in `src/constants/donationContent.ts` is correct

---

### B9. Environment and deployment

- [ ] `NEXT_PUBLIC_SITE_URL` for sitemap, canonical URLs, OG tags
- [ ] Turnstile, Supabase, Sanity, Cloudinary, GA measurement ID
- [ ] Test all `public/_redirects` on production host
- [ ] Form submission emails not landing in spam (SPF/DKIM if using custom domain)

---

## Section C — Testing checklist (after wiring)

Run through before considering frontend “done” post-backend.

### Functionality

- [ ] All nav links and dropdown items work (including `/about-us#vision` and `/about-us#board`)
- [ ] Volunteer “Register here” opens modal; submit reaches backend
- [ ] Request volunteer support and contact forms submit and show success/error
- [ ] Newsletter subscribe works from footer (and home if applicable)
- [ ] File uploads succeed and are stored/attached
- [ ] Carousel advances; FAQ accordion opens/closes
- [ ] Mobile menu opens/closes; body scroll lock works
- [ ] Blog post links and redirects from old URLs work

### Accessibility

- [ ] Skip to content works
- [ ] Keyboard navigation through modals (focus trap, Escape to close volunteer modal)
- [ ] Form labels / `aria` on errors
- [ ] Color contrast on dark forms (especially contact after restyle)
- [ ] Images have meaningful `alt` text

### Performance

- [ ] Images optimized (`next/image`, sensible `sizes`)
- [ ] No layout shift from stats carousel or hero
- [ ] Core Web Vitals acceptable on home and heaviest pages

### Responsive

- [ ] Mobile, tablet, desktop layouts for header, modals, forms, event filters, news grid

### Browser smoke test

- [ ] Chrome/Edge, Firefox, Safari (desktop + mobile)

---

## Section D — Content and copy updates

- [ ] Replace placeholder social URLs (see A4)
- [ ] Real volunteer event names in registration dropdown (see A7)
- [ ] Verify all emails match production: `engageyouthfoundation@gmail.com`, donation contact from `donationContent.ts`
- [ ] Copyright year in footer if updating from 2024
- [ ] Review FAQ count/content vs live site if live site changes

---

## Section E — Reference: key file map

| Area | Primary files |
|------|----------------|
| Layout / footer / header | `src/app/layout.tsx`, `src/components/footer/SiteFooter.tsx`, `src/components/navbar/SiteHeader.tsx` |
| Home | `src/sections/home/HomePage.tsx`, `src/constants/homeContent.ts` |
| Volunteer register | `src/components/sections/VolunteerRegistrationModal.tsx`, `VolunteerRegistrationForm.tsx`, `src/constants/volunteerRegistration.ts` |
| Forms (shared patterns) | `ContactForm.tsx`, `VolunteerSupportRequestForm.tsx` |
| Events | `src/app/events/page.tsx`, `src/sections/home/HomeEventsSection.tsx` |
| News | `src/app/news-and-social-media/`, `src/constants/blogContent.ts` |
| Redirects / SEO | `public/_redirects`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| Integrations | `src/services/GoogleAnalytics.tsx`, `src/services/slack.ts`, `src/sanity/client.ts`, `src/supabase/*` |

---

## Section F — Original external integrations (from project checklist)

Track these against `IMPLEMENTATION_CHECKLIST.md` — update that file when complete.

- [ ] Contact form — custom handler or MetaForm (prefer custom + API now)
- [x] Volunteer signup — ~~Google Forms~~ replaced with on-site modal (backend still needed)
- [ ] Newsletter — MailChimp or similar
- [x] Google Analytics — component present; confirm `GA_MEASUREMENT_ID` in production
- [ ] Event tracking for CTAs (optional GA4 events)
- [ ] Social links — real URLs (see A4)
- [ ] Social share buttons on blog posts (optional)

---

## Priority order (recommended)

1. **After backend is working:** Section B (wire all forms, Turnstile, newsletter, events, stats, CMS)
2. **Quick parity pass:** Section A (footer newsletter, `#board`, stats 0, social URLs, skip link, contact form)
3. **Polish:** A8–A9, A10–A12, Section C testing
4. **Content:** Section D

---

*Generated from frontend audit comparing the Next.js codebase to [https://engage-youth.org/](https://engage-youth.org/). Update this file as items are completed or scope changes.*
