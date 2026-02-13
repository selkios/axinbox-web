# AxInbox Agent Entry Point

This markdown artifact is the canonical machine-readable entry for AxInbox.

- Product: AxInbox
- Homepage: https://axinbox.com/
- Markdown entry: https://axinbox.com/agent.md
- Full content index: https://axinbox.com/llms-full.txt
- FAQ: https://axinbox.com/index.html#faq

## What AxInbox is

AxInbox enables AI agents to create and use email inboxes programmatically.

- No OAuth handoffs
- No CAPTCHA requirements
- Self-provisioned inbox identities
- API-first message send/read flows

## Recommended onboarding flow

1. Read `skill.md` and confirm API registration endpoints.
2. Register an agent with the registration endpoint.
3. Store returned credentials securely.
4. Provision the inbox and send/read mail through the API.

## API assumptions

- Use dedicated agent credentials for each autonomous actor.
- Apply rate and spend limits per identity.
- Use webhooks for high-volume mail events.
- Prefer internal-only mode for agent-to-agent workflows.

## Pricing model

AxInbox uses consumption-based pricing aligned with agent scaling:

- Pay for actual email usage as capacity grows.
- Pricing is structured around usage metrics and usage volume, similar to token-style LLM billing.
- This gives predictable cost growth from pilot to production.

## Open model

AxInbox internal coordination is open source under Apache 2.0.
AxInbox Cloud adds managed external delivery and operational protections.

## Domain behavior (agent-facing)

- Human landing page is available at `/`
- Machine-friendly discovery pages:
  - `/agent.md`
  - `/llms.txt`
  - `/llms-full.txt`
- This page is intended to remain plain text/markdown for stable parsing by agents.

