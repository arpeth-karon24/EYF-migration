# Slack Webhook Setup Guide

## Quick Setup (2-3 minutes)

### Step 1: Create a Slack Workspace Channel (if needed)
1. Go to your Slack workspace
2. Create a new channel (e.g., `#contact-form-submissions` or `#eyf-notifications`)
3. Note the channel name

### Step 2: Create an Incoming Webhook

1. Visit: https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. App Name: `EYF Contact Form`
4. Pick your workspace
5. Click **Create App**

### Step 3: Enable Incoming Webhooks

1. In the left sidebar, click **Incoming Webhooks**
2. Toggle **Activate Incoming Webhooks** to **ON**
3. Click **Add New Webhook to Workspace**
4. Select your channel (e.g., `#contact-form-submissions`)
5. Click **Allow**

### Step 4: Copy Your Webhook URL

1. You'll see a new webhook URL created
2. Copy the URL (looks like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`)

### Step 5: Add to Environment

Create `.env.local` in your project root:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

Replace with your actual webhook URL.

## Testing

### Option 1: Test via curl
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test message from EYF"}' \
  $SLACK_WEBHOOK_URL
```

### Option 2: Fill the Contact Form
1. Go to `/contact-us`
2. Fill out and submit the form
3. Check your Slack channel - you should see the message!

## Message Format

Contact form submissions will appear in Slack like this:

```
📧 New Contact Form Submission

Name: John Doe
Email: john@example.com
Subject: Volunteer Inquiry

Message:
Hi, I'm interested in volunteering with EYF...
```

## Troubleshooting

### Messages not appearing?
1. Check the webhook URL is correct in `.env.local`
2. Verify the channel still exists
3. Restart your dev server: `npm run dev`
4. Check browser console for errors

### "Invalid webhook"?
- Regenerate the webhook URL from Slack API dashboard
- Update `.env.local` with the new URL

### Multiple Channels?
Create multiple webhooks and add environment variables:
```env
SLACK_WEBHOOK_URL=...channel1...
SLACK_WEBHOOK_ADMIN=...channel2...
```

Then update the form handler to use different channels.

## Disabling Slack Notifications

To disable Slack notifications without removing the code:

**Option 1**: Remove `SLACK_WEBHOOK_URL` from `.env.local`

**Option 2**: Update the handler to add a check:
```typescript
// In contact form handler
if (!process.env.SLACK_WEBHOOK_URL) {
  console.log('Slack notifications disabled');
  return { success: true };
}
```

## Security Notes

✅ **Best Practices:**
- Never commit `.env.local` to git
- Rotate webhook URL if compromised
- Use different webhooks for different environments
- Limit webhook permissions to specific channels

## Advanced: Send to Multiple Channels

Edit `src/app/contact-us/page.tsx`:

```typescript
// Send to multiple Slack channels
await postSlackMessage(slackMessage); // Primary channel
await postSlackMessage(slackMessage); // Add more as needed
```

Or create separate handlers in `src/services/slack.ts`:

```typescript
export async function postSlackToChannel(text: string, webhookUrl: string) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
```

## Support

For issues with Slack webhooks:
- Slack Webhook Docs: https://api.slack.com/messaging/webhooks
- Test Webhook: https://webhook.site/
- API Status: https://status.slack.com

## Next Steps

✅ Webhook configured!

Now you can:
1. Test the contact form at `/contact-us`
2. Verify messages appear in your Slack channel
3. Deploy to production
4. Add webhook URL to production `.env.local`
