export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // MCP Server Card — SEP-2127 / modelcontextprotocol spec
  const serverCard = {
    schemaVersion: "1.0",
    serverInfo: {
      name: "SendFast",
      version: "1.0.0",
      description:
        "The agentic file transfer service. Upload, encrypt, and share files via REST API. AI agents can send encrypted files to humans, create receive links, and track downloads.",
      contact: {
        url: `${baseUrl}`,
      },
    },
    transport: [
      {
        type: "http",
        url: `${baseUrl}/api/mcp`,
      },
    ],
    capabilities: {
      tools: {
        upload_file: {
          description:
            "Upload and encrypt a file, returning a shareable download link",
        },
        create_transfer: {
          description:
            "Create a new encrypted file transfer with optional password and expiry",
        },
        get_transfer: {
          description: "Get the status and download count of a transfer",
        },
        delete_transfer: {
          description: "Delete a transfer and remove its files",
        },
      },
      resources: {
        "transfer://": {
          description: "Access transfer metadata and download links",
        },
      },
    },
    auth: {
      type: "bearer",
      description: "API key required for Pro plan features. Free tier is unauthenticated.",
    },
    documentation: `${baseUrl}/llms-full.txt`,
    agentSkills: `${baseUrl}/.well-known/agent-skills/index.json`,
  };

  return Response.json(serverCard, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
