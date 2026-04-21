export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("host") || "sendfast.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // Product catalog for Agentic Commerce Protocol
  // Agents query this to understand what SendFast offers and at what price
  const products = {
    merchant: {
      name: "SendFast",
      url: baseUrl,
      description: "End-to-end encrypted file transfer. Built for humans and AI agents.",
    },
    products: [
      {
        id: "sendfast-starter",
        stripe_product_id: process.env.STRIPE_STARTER_PRODUCT_ID || null,
        name: "SendFast Starter",
        description:
          "25 GB per transfer, 30-day link expiry, 100 transfers/month. Includes password protection, email delivery, and download tracking.",
        category: "software_as_a_service",
        stripe_product_tax_code: "txcd_10103001", // SaaS — digital services
        type: "subscription",
        billing_interval: "month",
        price: {
          amount: 900, // cents
          currency: "usd",
          stripe_price_id: process.env.STRIPE_STARTER_PRICE_ID || null,
        },
        features: [
          "25 GB per transfer",
          "30-day link expiry",
          "100 transfers/month",
          "Password protection",
          "Email delivery",
          "Download tracking",
          "AES-256-GCM encryption",
        ],
        url: `${baseUrl}/pricing`,
        image_url: `${baseUrl}/og-starter.png`,
      },
      {
        id: "sendfast-pro",
        stripe_product_id: process.env.STRIPE_PRO_PRODUCT_ID || null,
        name: "SendFast Pro",
        description:
          "100 GB per transfer, 90-day link expiry, 500 transfers/month. Includes REST API access, custom branding, and all Starter features.",
        category: "software_as_a_service",
        stripe_product_tax_code: "txcd_10103001",
        type: "subscription",
        billing_interval: "month",
        price: {
          amount: 1900, // cents
          currency: "usd",
          stripe_price_id: process.env.STRIPE_PRO_PRICE_ID || null,
        },
        features: [
          "100 GB per transfer",
          "90-day link expiry",
          "500 transfers/month",
          "REST API access",
          "Custom branding",
          "Password protection",
          "Email delivery",
          "Download tracking",
          "AES-256-GCM encryption",
        ],
        url: `${baseUrl}/pricing`,
        image_url: `${baseUrl}/og-pro.png`,
      },
    ],
    policies: {
      terms_of_service: `${baseUrl}/terms`,
      privacy_policy: `${baseUrl}/privacy`,
      refund_policy: `${baseUrl}/refund`,
    },
    updated_at: new Date().toISOString(),
  };

  return Response.json(products, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
