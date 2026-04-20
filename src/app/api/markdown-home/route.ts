export const dynamic = "force-dynamic";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sendfast.app";

  const markdown = `# SendFast — The Agentic File Transfer Service

> Send files. Fast. Encrypted.

SendFast is an end-to-end encrypted file transfer service built for humans and AI agents.
Files are encrypted client-side using AES-256-GCM. The encryption key lives in the URL
fragment and never touches our servers — true zero-knowledge architecture.

## Quick Links

- [How It Works](${baseUrl}/llms-full.txt) — Full technical reference for AI agents
- [Pricing](${baseUrl}/pricing) — Free, Starter ($9/mo), Pro ($19/mo)
- [API Reference](${baseUrl}/llms-full.txt#api) — REST API for agentic workflows
- [Sign Up](${baseUrl}/auth/signup) — Create an account
- [Sign In](${baseUrl}/auth/signin) — Access your dashboard

## Key Features

- **AES-256-GCM end-to-end encryption** — encrypted in your browser, not on our servers
- **Zero-knowledge** — we never see your files or encryption keys
- **No account required** — free transfers work without signing up
- **AI agent ready** — REST API for programmatic file transfer
- **Password protection** — optional password on any transfer
- **Auto-expiring links** — 7 days (free) up to 90 days (Pro)
- **Email delivery** — notify recipients directly
- **Receive links** — collect files from users securely

## Pricing

| Plan | Price | Transfer Size | Expiry | Transfers/month |
|------|-------|--------------|--------|-----------------|
| Free | $0 | 2 GB | 7 days | 10 |
| Starter | $9/mo | 25 GB | 30 days | 100 |
| Pro | $19/mo | 100 GB | 90 days | 500 + API access |

## Agent Integration

AI agents can use SendFast to:
1. Upload encrypted files via REST API and share the download link with users
2. Create receive links so users can upload files for agent processing
3. Send files to a user's email with a custom message
4. Password-protect sensitive transfers
5. Set custom expiry times (1h to 90 days)

## Machine-Readable Resources

- API Catalog: ${baseUrl}/.well-known/api-catalog
- MCP Server Card: ${baseUrl}/.well-known/mcp/server-card.json
- Agent Skills: ${baseUrl}/.well-known/agent-skills/index.json
- Full LLM Reference: ${baseUrl}/llms-full.txt
`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Markdown-Tokens": "true",
    },
  });
}
