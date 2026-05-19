# API Contract

All lead endpoints share the same request envelope and response patterns.

## Base URL

| Environment | Base |
|-------------|------|
| Production | `https://engage-youth.org` (same-origin) |
| Local (Wrangler) | `http://localhost:8788` (or Wrangler-assigned port) |
| Optional override | `NEXT_PUBLIC_API_BASE_URL` on the client |

Paths are always `/api/{workflow}`.

## Request

**Method:** `POST`  
**Header:** `Content-Type: application/json`

```json
{
  "turnstileToken": "string",
  "payload": {}
}
```

During local development without Turnstile configured, the server may accept a bypass flag only in dev (document in Phase 3 — never in production).

## Responses

### Success — `200`

```json
{
  "ok": true,
  "message": "Thank you. We received your submission."
}
```

### Validation error — `400`

```json
{
  "ok": false,
  "error": "validation_error",
  "message": "Email is required.",
  "fields": {
    "email": "Invalid email address"
  }
}
```

`fields` is optional; include when useful for inline form errors.

### Turnstile failed — `403`

```json
{
  "ok": false,
  "error": "turnstile_failed",
  "message": "Security verification failed. Please try again."
}
```

### Method not allowed — `405`

```json
{
  "ok": false,
  "error": "method_not_allowed",
  "message": "Method not allowed"
}
```

### Rate limited — `429` (Phase 5)

```json
{
  "ok": false,
  "error": "rate_limited",
  "message": "Too many requests. Please try again later."
}
```

### Server error — `500`

```json
{
  "ok": false,
  "error": "internal_error",
  "message": "Something went wrong. Please try again."
}
```

Never return stack traces or Resend API keys to the client.

## CORS

- `OPTIONS` preflight supported on all `/api/*` routes.
- `Access-Control-Allow-Origin` restricted to `ALLOWED_ORIGINS` in production.
- Allow `POST`, `Content-Type`.

## Workflow payloads

### Contact — `POST /api/contact`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | max length TBD (e.g. 120) |
| `email` | string | yes | valid email |
| `message` | string | yes | max length e.g. 5000 |
| `subject` | string | no | UI field missing today — add or omit |

**File upload:** not in v1 API; see Phase 5. UI currently has file input — disable or keep for future.

### Volunteer — `POST /api/volunteer`

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes |
| `email` | string | yes |
| `contactNumber` | string | yes |
| `eventTitle` | string | yes |
| `city` | string | yes |
| `availability` | string | yes |
| `skillsAndInterests` | string | yes |
| `motivation` | string | yes |
| `emergencyContact` | string | yes |
| `agreeToGuidelines` | boolean | yes — must be `true` |

### Newsletter — `POST /api/newsletter`

| Field | Type | Required |
|-------|------|----------|
| `email` | string | yes |

### Donation (cheque collection) — `POST /api/donation`

**New form** to be added on `/donation` in Phase 4.

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes |
| `email` | string | yes |
| `phone` | string | yes |
| `address` | string | yes |
| `preferredDate` | string | yes |
| `amount` | string | no |
| `notes` | string | no |

### Volunteer support — `POST /api/support`

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes |
| `date` | string | yes |
| `time` | string | yes |
| `location` | string | yes |
| `volunteersNeeded` | string | yes |
| `email` | string | yes |
| `phone` | string | yes |
| `eventDescription` | string | yes |

**File upload:** same as contact — defer v1 or Phase 5.

## Admin email subjects (examples)

| Workflow | Subject pattern |
|----------|-----------------|
| Contact | `[EYF Contact] {name}` |
| Volunteer | `[EYF Volunteer] {name} — {eventTitle}` |
| Newsletter | `[EYF Newsletter] New subscriber` |
| Donation | `[EYF Donation] Cheque collection — {name}` |
| Support | `[EYF Volunteer Support] {name} — {date}` |

## Client helper (conceptual)

```ts
// src/lib/api/leads.ts
export async function submitContact(
  payload: ContactPayload,
  turnstileToken: string
): Promise<ApiSuccess> {
  const res = await fetch(`${getApiBase()}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turnstileToken, payload }),
  });
  return handleApiResponse(res);
}
```

Repeat for `submitVolunteer`, `submitNewsletter`, `submitDonation`, `submitSupport`.
