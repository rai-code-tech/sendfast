import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, PlanKey } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getPlanByPriceId(priceId: string): PlanKey {
  for (const [key, plan] of Object.entries(PLANS)) {
    if ("priceId" in plan && plan.priceId === priceId) {
      return key as PlanKey;
    }
  }
  return "free";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (!userId) {
          console.error("No userId in checkout session metadata");
          break;
        }

        // Retrieve the subscription to get the price ID
        const subscriptionId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id;
        const plan = getPlanByPriceId(priceId);

        // Calculate subscription end from latest invoice period
        const latestInvoice = sub.latest_invoice;
        let subscriptionEnd: Date | null = null;
        if (typeof latestInvoice === "string") {
          const invoice = await stripe.invoices.retrieve(latestInvoice);
          if (invoice.lines.data[0]?.period?.end) {
            subscriptionEnd = new Date(invoice.lines.data[0].period.end * 1000);
          }
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeCustomerId: customerId,
            subscriptionId,
            subscriptionEnd,
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const plan = getPlanByPriceId(priceId);
        const customerId = subscription.customer as string;

        // Get period end from latest invoice
        let subEnd: Date | null = null;
        const inv = subscription.latest_invoice;
        if (typeof inv === "string") {
          const invoice = await stripe.invoices.retrieve(inv);
          if (invoice.lines.data[0]?.period?.end) {
            subEnd = new Date(invoice.lines.data[0].period.end * 1000);
          }
        }

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan,
            subscriptionEnd: subEnd,
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan: "free",
            subscriptionId: null,
            subscriptionEnd: null,
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
