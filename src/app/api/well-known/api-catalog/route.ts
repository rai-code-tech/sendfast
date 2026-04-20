export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // RFC 9727 — API Catalog using application/linkset+json
  const catalog = {
    linkset: [
      {
        anchor: `${baseUrl}/api`,
        "service-desc": [
          {
            href: `${baseUrl}/llms-full.txt`,
            type: "text/markdown",
            title: "SendFast API Reference (Markdown)",
          },
        ],
        "service-doc": [
          {
            href: `${baseUrl}/llms-full.txt`,
            type: "text/markdown",
            title: "SendFast Developer Docs",
          },
        ],
        describedby: [
          {
            href: `${baseUrl}/llms.txt`,
            type: "text/markdown",
            title: "SendFast Agent Overview",
          },
        ],
        type: [
          {
            href: "https://schema.org/WebAPI",
          },
        ],
      },
      {
        anchor: `${baseUrl}/api/upload`,
        "service-desc": [
          {
            href: `${baseUrl}/llms-full.txt`,
            type: "text/markdown",
            title: "File Upload API",
          },
        ],
        type: [{ href: "https://schema.org/UploadAction" }],
      },
      {
        anchor: `${baseUrl}/api/transfers`,
        "service-desc": [
          {
            href: `${baseUrl}/llms-full.txt`,
            type: "text/markdown",
            title: "Transfers API",
          },
        ],
      },
    ],
  };

  return Response.json(catalog, {
    headers: {
      "Content-Type": "application/linkset+json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
