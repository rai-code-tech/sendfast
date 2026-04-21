export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // Agentic Commerce Protocol (ACP) discovery document
  // Jointly specified by Stripe & OpenAI — https://agenticcommerce.dev
  const acp = {
    version: "1.0.0",
    provider: "stripe",
    merchant_name: "SendFast",
    merchant_url: baseUrl,
    // Stripe ACS handles checkout — agents call Stripe directly
    checkout_endpoint: "https://api.stripe.com/v1/checkout/sessions",
    capabilities: ["checkout", "subscriptions", "digital_goods"],
    products_feed: `${baseUrl}/api/acp/products`,
    policies: {
      terms_of_service: `${baseUrl}/terms`,
      privacy_policy: `${baseUrl}/privacy`,
      refund_policy: `${baseUrl}/refund`,
      shop_policy: `${baseUrl}/terms`,
    },
    support: {
      email: "support@sendfast.app",
      url: `${baseUrl}/pricing`,
    },
    currencies_supported: ["usd", "eur"],
    fulfillment: "digital",
  };

  return Response.json(acp, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
