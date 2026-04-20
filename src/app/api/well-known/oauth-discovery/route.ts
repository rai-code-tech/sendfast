export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // OAuth 2.0 Authorization Server Metadata (RFC 8414)
  // Also serves as OpenID Connect Discovery (openid-configuration)
  const metadata = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/auth/signin`,
    token_endpoint: `${baseUrl}/api/auth/token`,
    userinfo_endpoint: `${baseUrl}/api/auth/user`,
    jwks_uri: `${baseUrl}/api/auth/jwks`,
    registration_endpoint: `${baseUrl}/auth/signup`,
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "files:read",
      "files:write",
      "files:delete",
      "transfers:read",
      "transfers:write",
    ],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "none"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["HS256"],
    claims_supported: ["sub", "iss", "name", "email", "email_verified"],
    service_documentation: `${baseUrl}/llms-full.txt`,
  };

  return Response.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
