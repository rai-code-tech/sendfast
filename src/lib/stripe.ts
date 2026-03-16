import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxTransfersPerDay: 5,
    maxExpiry: "24h",
    emailDelivery: false,
    tracking: false,
    passwordProtection: false,
    customBranding: false,
    maxRecipients: 0,
  },
  starter: {
    name: "Starter",
    price: 9,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
    maxTransfersPerDay: Infinity,
    maxExpiry: "30d",
    emailDelivery: true,
    tracking: true,
    passwordProtection: true,
    customBranding: false,
    maxRecipients: 10,
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    maxFileSize: Infinity,
    maxTransfersPerDay: Infinity,
    maxExpiry: "never",
    emailDelivery: true,
    tracking: true,
    passwordProtection: true,
    customBranding: true,
    maxRecipients: 50,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlan(planKey: string) {
  return PLANS[planKey as PlanKey] || PLANS.free;
}
