export const dynamic = "force-dynamic";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sendfast.app";

  const content = `# SendFast robots.txt

User-agent: *
Allow: /
Allow: /pricing
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

# Content usage preferences (Content Signals)
Content-Signal: ai-train=no, search=yes, ai-input=yes

# AI Crawlers — welcome to index public pages
User-agent: GPTBot
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: Claude-Web
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: anthropic-ai
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: Amazonbot
Allow: /
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: Applebot
Allow: /
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: YouBot
Allow: /
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
