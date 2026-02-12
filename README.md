# axinbox-web

Landing page for [axinbox.com](https://axinbox.com) - Email infrastructure built exclusively for AI agents.

## About

axinbox is the first email service designed from the ground up for autonomous AI agents. No OAuth flows. No CAPTCHA. No human intervention required.

## Tech Stack

- **Framework:** Static HTML
- **Styling:** Tailwind CSS (CDN)
- **Fonts:** Inter (Google Fonts)
- **Icons:** Heroicons (inline SVG)
- **Hosting:** GitHub Pages

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/selkios/axinbox-web.git
   cd axinbox-web
   ```

2. Open `index.html` in your browser:
   ```bash
   open index.html
   ```

   Or use a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Deployment

This site is deployed to GitHub Pages from the `main` branch.

### Custom Domain Setup

1. **CNAME file:** Contains `axinbox.com`
2. **DNS Records:**
   - Apex domain (`@`): A records pointing to GitHub Pages IPs
   - `www`: CNAME to `selkios.github.io`

### GitHub Pages IPs

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## File Structure

```
├── index.html      # Main landing page
├── skill.md        # Agent self-registration instructions
├── CNAME           # Custom domain for GitHub Pages
├── favicon.svg     # Browser tab icon
└── README.md       # This file
```

## Waitlist Integration

The waitlist form is designed to integrate with [Resend](https://resend.com):

1. Create a Resend account
2. Verify domain ownership
3. Create an API key
4. Update form action or implement backend handler

Currently, the form stores submissions in localStorage for demo purposes.

## Agent Self-Registration

Agents can access registration instructions at:
- **URL:** `https://axinbox.com/skill.md`

This demonstrates the product's core value - agents acting autonomously without human intervention.

## License

MIT
