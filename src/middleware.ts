import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Markdown content negotiation (Cloudflare Markdown for Agents standard)
  // When an agent requests text/markdown, return the markdown version of the page
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/markdown") && pathname === "/") {
    return NextResponse.rewrite(new URL("/api/markdown-home", request.url));
  }

  const response = NextResponse.next();

  // Add Link response headers on the homepage for agent discovery (RFC 8288)
  if (pathname === "/") {
    response.headers.set(
      "Link",
      [
        '</.well-known/api-catalog>; rel="api-catalog"',
        '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
        '</.well-known/agent-skills/index.json>; rel="agent-skills"',
        '</llms.txt>; rel="describedby"; type="text/markdown"',
        '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      ].join(", ")
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Run on homepage and all pages except static assets and API routes
    "/",
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
