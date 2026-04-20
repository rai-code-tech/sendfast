export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // OAuth 2.0 Protected Resource Metadata (RFC 9728)
  const metadata = {
    resource: baseUrl,
    authorization_servers: [baseUrl],
    bearer_methods_supported: ["header"],
    scopes_supported: [
      "files:read",
      "files:write",
      "files:delete",
      "transfers:read",
      "transfers:write",
    ],
    resource_documentation: `${baseUrl}/llms-full.txt`,
    resource_signing_alg_values_supported: ["HS256"],
  };

  return Response.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
