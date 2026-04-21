/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  async rewrites() {
    return [
      // Dynamic robots.txt (supports Content-Signal + correct domain from env)
      { source: "/robots.txt", destination: "/api/robots-txt" },
      // Agent-ready well-known endpoints
      { source: "/.well-known/api-catalog", destination: "/api/well-known/api-catalog" },
      { source: "/.well-known/mcp/server-card.json", destination: "/api/well-known/mcp-server-card" },
      { source: "/.well-known/agent-skills/index.json", destination: "/api/well-known/agent-skills" },
      { source: "/.well-known/openid-configuration", destination: "/api/well-known/oauth-discovery" },
      { source: "/.well-known/oauth-authorization-server", destination: "/api/well-known/oauth-discovery" },
      { source: "/.well-known/oauth-protected-resource", destination: "/api/well-known/oauth-protected-resource" },
      { source: "/.well-known/acp.json", destination: "/api/well-known/acp" },
    ];
  },
};

module.exports = nextConfig;
