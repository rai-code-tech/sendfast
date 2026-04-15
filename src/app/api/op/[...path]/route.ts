import { createRouteHandler } from "@openpanel/nextjs/server";

const handler = createRouteHandler({
  apiUrl: "https://analytics.raicode.tech",
});

export const GET = handler.GET;
export const POST = handler.POST;
