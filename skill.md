---
name: axinbox
version: 1.0.0
description: Email infrastructure for AI agents. Send, receive, and manage email programmatically without OAuth, CAPTCHA, or human intervention.
homepage: https://axinbox.com
---

# axinbox Agent Skill

Email infrastructure designed exclusively for AI agents. This document provides instructions for autonomous agents to register, authenticate, and use axinbox services.

## Registration

Create a new agent email account with a single API call:

```http
POST https://api.axinbox.com/v1/agents/register
Content-Type: application/json

{
  "agent_name": "your-agent-name",
  "callback_url": "https://your-server.com/webhooks/axinbox"
}
```

**Response:**

```json
{
  "agent_id": "ag_xxxxxxxxxxxx",
  "api_key": "axi_live_xxxxxxxxxxxxxxxxxxxxxx",
  "email_address": "your-agent-name@agent.axinbox.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

> **Important:** Store the `api_key` securely. It will not be shown again.

## Authentication

All API requests require authentication via the `Authorization` header:

```http
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

Include this header in every request to axinbox API endpoints.

## Send Email

Send an email programmatically:

```http
POST https://api.axinbox.com/v1/email/send
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json

{
  "to": ["recipient@example.com"],
  "subject": "Hello from AI Agent",
  "html": "<p>This email was sent by an autonomous AI agent.</p>",
  "text": "This email was sent by an autonomous AI agent."
}
```

**Response:**

```json
{
  "message_id": "msg_xxxxxxxxxxxx",
  "status": "sent",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `cc` | array | CC recipients |
| `bcc` | array | BCC recipients |
| `reply_to` | string | Reply-to address |
| `headers` | object | Custom email headers |
| `attachments` | array | File attachments (base64) |

## Receive Email

### Method 1: Webhooks (Recommended)

Configure a webhook URL during registration. axinbox will POST incoming emails to your endpoint:

```json
{
  "event": "email.received",
  "timestamp": "2024-01-15T11:00:00Z",
  "data": {
    "message_id": "msg_xxxxxxxxxxxx",
    "from": "sender@example.com",
    "to": ["your-agent@agent.axinbox.com"],
    "subject": "Re: Hello",
    "html": "<p>Response content...</p>",
    "text": "Response content...",
    "headers": {},
    "attachments": []
  }
}
```

### Method 2: Polling

List recent emails:

```http
GET https://api.axinbox.com/v1/email/list?limit=50&unread=true
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

Get specific email:

```http
GET https://api.axinbox.com/v1/email/{message_id}
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

## Inbox Management

### List Emails

```http
GET https://api.axinbox.com/v1/email/list
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

Query parameters:
- `limit` - Number of results (default: 50, max: 500)
- `offset` - Pagination offset
- `unread` - Filter unread only (true/false)
- `from` - Filter by sender
- `after` - ISO timestamp for emails after this date

### Mark as Read

```http
POST https://api.axinbox.com/v1/email/{message_id}/read
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

### Delete Email

```http
DELETE https://api.axinbox.com/v1/email/{message_id}
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

### Search Emails

```http
GET https://api.axinbox.com/v1/email/search?q=keyword
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

## Identity & Reputation

### Check Sender Reputation

```http
GET https://api.axinbox.com/v1/reputation
Authorization: Bearer axi_live_xxxxxxxxxxxxxxxxxxxxxx
```

**Response:**

```json
{
  "reputation_score": 95,
  "delivery_rate": 0.998,
  "spam_complaints": 0,
  "bounces": 2,
  "total_sent": 1000,
  "ip_pool": "dedicated"
}
```

### Build Reputation

New accounts start with limited sending capacity. Reputation builds automatically:
- Start: 100 emails/day
- Good standing (7 days): 1,000 emails/day
- Verified domain: 10,000 emails/day
- Enterprise: Unlimited

## Rate Limits

| Tier | Emails/Day | API Requests/Minute |
|------|------------|---------------------|
| Starter | 100 | 60 |
| Growth | 1,000 | 300 |
| Scale | 10,000 | 1,000 |
| Enterprise | Unlimited | Unlimited |

Rate limit headers included in every response:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705312800
```

## Webhook Events

Subscribe to real-time events:

| Event | Description |
|-------|-------------|
| `email.received` | New email in inbox |
| `email.sent` | Email successfully sent |
| `email.delivered` | Email delivered to recipient |
| `email.opened` | Recipient opened email |
| `email.clicked` | Recipient clicked link |
| `email.bounced` | Email bounced |
| `email.complained` | Spam complaint received |

### Webhook Signature Verification

Verify webhook authenticity using the signature header:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature === expectedSignature;
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "details": {
      "retry_after": 60
    }
  }
}
```

Common error codes:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INVALID_EMAIL` | 400 | Malformed email address |
| `MESSAGE_TOO_LARGE` | 413 | Email exceeds size limit |
| `REPUTATION_LOW` | 403 | Sender reputation too low |

## Security Warnings

1. **Protect Your API Key** - Never expose it in client-side code or public repositories
2. **Use Environment Variables** - Store credentials securely
3. **Rotate Keys** - Regenerate API keys periodically
4. **Validate Webhooks** - Always verify webhook signatures
5. **Log Activity** - Monitor API usage for anomalies

## Quick Start Example

```bash
# 1. Register agent
curl -X POST https://api.axinbox.com/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"agent_name": "my-ai-assistant"}'

# 2. Save the API key from response
export AXINBOX_API_KEY="axi_live_xxxxxxxxxxxx"

# 3. Send first email
curl -X POST https://api.axinbox.com/v1/email/send \
  -H "Authorization: Bearer $AXINBOX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@example.com"],
    "subject": "Hello from my AI agent",
    "text": "This is my first automated email!"
  }'

# 4. Check inbox
curl https://api.axinbox.com/v1/email/list \
  -H "Authorization: Bearer $AXINBOX_API_KEY"
```

## Support

- Documentation: https://axinbox.com/docs
- Status: https://status.axinbox.com
- Email: support@axinbox.com

---

*Note: This service is currently in development. API endpoints will be available upon launch. Join the waitlist at https://axinbox.com to get early access.*
