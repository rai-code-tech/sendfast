export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // Agent Skills Discovery RFC v0.2.0
  const index = {
    $schema: "https://agentskills.io/schema/v0.2.0/index.json",
    name: "SendFast Agent Skills",
    description:
      "Skills for uploading, sharing, and managing encrypted file transfers via SendFast",
    publisher: {
      name: "SendFast",
      url: baseUrl,
    },
    skills: [
      {
        name: "upload-and-share-file",
        type: "http",
        description:
          "Upload a file to SendFast with AES-256-GCM encryption and get a shareable download link. Supports password protection, custom expiry, and email delivery.",
        url: `${baseUrl}/api/upload`,
        method: "POST",
        inputSchema: {
          type: "object",
          properties: {
            fileName: { type: "string", description: "Name of the file" },
            fileSize: { type: "number", description: "File size in bytes" },
            mimeType: { type: "string", description: "MIME type of the file" },
            password: {
              type: "string",
              description: "Optional password to protect the transfer",
            },
            expiresIn: {
              type: "number",
              description: "Expiry time in hours (1-2160)",
            },
            recipientEmail: {
              type: "string",
              description: "Optional email to notify the recipient",
            },
          },
          required: ["fileName", "fileSize", "mimeType"],
        },
        outputSchema: {
          type: "object",
          properties: {
            transferId: { type: "string" },
            downloadUrl: { type: "string" },
            presignedUrls: { type: "array" },
          },
        },
        sha256:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      {
        name: "get-transfer-status",
        type: "http",
        description:
          "Get the status, download count, and metadata for an existing transfer",
        url: `${baseUrl}/api/transfers/{id}`,
        method: "GET",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Transfer ID" },
          },
          required: ["id"],
        },
        sha256:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      {
        name: "list-transfers",
        type: "http",
        description: "List all transfers for the authenticated user",
        url: `${baseUrl}/api/transfers`,
        method: "GET",
        auth: { type: "bearer" },
        sha256:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      {
        name: "delete-transfer",
        type: "http",
        description: "Delete a transfer and remove its encrypted files",
        url: `${baseUrl}/api/transfers/{id}`,
        method: "DELETE",
        auth: { type: "bearer" },
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Transfer ID" },
          },
          required: ["id"],
        },
        sha256:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
    ],
  };

  return Response.json(index, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
