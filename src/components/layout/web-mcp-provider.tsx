"use client";

import { useEffect } from "react";

// WebMCP — exposes SendFast tools to AI agents via the browser
// Spec: https://webmachinelearning.github.io/webmcp/
export function WebMCPProvider() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (!("modelContext" in navigator)) return;

    const nav = navigator as Navigator & {
      modelContext: {
        provideContext: (ctx: {
          tools: Array<{
            name: string;
            description: string;
            inputSchema: object;
            execute: (input: Record<string, unknown>) => Promise<unknown>;
          }>;
        }) => void;
      };
    };

    nav.modelContext.provideContext({
      tools: [
        {
          name: "sendfast_upload_file",
          description:
            "Upload a file to SendFast for end-to-end encrypted sharing. Returns a shareable download link. Files are encrypted in the browser with AES-256-GCM.",
          inputSchema: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                description: "The name of the file to upload",
              },
              fileContent: {
                type: "string",
                description: "Base64-encoded file content",
              },
              mimeType: {
                type: "string",
                description: "MIME type of the file",
              },
              password: {
                type: "string",
                description: "Optional password to protect the transfer",
              },
              expiresInHours: {
                type: "number",
                description: "How many hours until the link expires (default: 168)",
              },
            },
            required: ["fileName", "fileContent", "mimeType"],
          },
          execute: async (input) => {
            const response = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                files: [
                  {
                    name: input.fileName,
                    size: String(input.fileContent).length,
                    type: input.mimeType,
                  },
                ],
                password: input.password,
                expiresIn: input.expiresInHours,
              }),
            });
            return response.json();
          },
        },
        {
          name: "sendfast_get_transfer",
          description: "Get the status and download count of a SendFast transfer by ID",
          inputSchema: {
            type: "object",
            properties: {
              transferId: {
                type: "string",
                description: "The transfer ID",
              },
            },
            required: ["transferId"],
          },
          execute: async (input) => {
            const response = await fetch(`/api/transfers/${input.transferId}`);
            return response.json();
          },
        },
        {
          name: "sendfast_list_transfers",
          description: "List all active transfers for the current user",
          inputSchema: {
            type: "object",
            properties: {},
          },
          execute: async () => {
            const response = await fetch("/api/transfers");
            return response.json();
          },
        },
      ],
    });
  }, []);

  return null;
}
