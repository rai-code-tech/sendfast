"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Loader2, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for quick, one-off transfers",
    features: [
      "2 GB per transfer",
      "7-day expiry",
      "10 transfers per month",
      "End-to-end encryption",
      "Shareable links",
    ],
    limitations: [
      "No password protection",
      "No email delivery",
      "No download tracking",
      "No API access",
    ],
    cta: "Start Free",
    priceId: null,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9",
    period: "per month",
    description: "For professionals who send files regularly",
    features: [
      "25 GB per transfer",
      "30-day expiry",
      "100 transfers per month",
      "End-to-end encryption",
      "Password protection",
      "Email delivery",
      "Download tracking",
      "Priority support",
    ],
    limitations: ["No API access", "No custom branding"],
    cta: "Get Starter",
    priceId: "starter",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For teams and power users",
    features: [
      "100 GB per transfer",
      "90-day expiry",
      "500 transfers per month",
      "End-to-end encryption",
      "Password protection",
      "Email delivery",
      "Download tracking",
      "Priority support",
      "API access",
      "Custom branding",
      "Receive links",
    ],
    limitations: [],
    cta: "Get Pro",
    priceId: "pro",
  },
];

const comparison = [
  { feature: "Max transfer size", free: "2 GB", starter: "25 GB", pro: "100 GB" },
  { feature: "Link expiry", free: "7 days", starter: "30 days", pro: "90 days" },
  { feature: "Transfers per month", free: "10", starter: "100", pro: "500" },
  { feature: "End-to-end encryption", free: true, starter: true, pro: true },
  { feature: "Password protection", free: false, starter: true, pro: true },
  { feature: "Email delivery", free: false, starter: true, pro: true },
  { feature: "Download tracking", free: false, starter: true, pro: true },
  { feature: "API access", free: false, starter: false, pro: true },
  { feature: "Custom branding", free: false, starter: false, pro: true },
  { feature: "Receive links", free: false, starter: false, pro: true },
  { feature: "Support", free: "Community", starter: "Priority", pro: "Priority" },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectPlan = async (plan: (typeof plans)[0]) => {
    if (!plan.priceId) {
      router.push("/");
      return;
    }

    if (!session) {
      router.push(`/auth/signup?plan=${plan.id}`);
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { url } = await response.json();
      window.location.href = url;
    } catch {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-noise">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-1.5 text-sm text-emerald-300 mb-6">
            <Zap className="h-3.5 w-3.5" />
            <span className="font-medium">Simple pricing</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Pick the plan that{" "}
            <span className="gradient-text">fits your needs</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Start free with generous limits. Upgrade anytime for more storage,
            longer expiry, and premium features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-28 stagger-children">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 md:p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "border border-emerald-500/40 bg-zinc-900/60 popular-ring md:scale-[1.03]"
                  : "border border-zinc-800/60 bg-zinc-900/30 hover-glow"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-zinc-500">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-zinc-300"
                  >
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li
                    key={limitation}
                    className="flex items-start gap-2.5 text-sm text-zinc-600"
                  >
                    <X className="h-4 w-4 text-zinc-700 mt-0.5 shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full h-12 font-semibold transition-all ${
                  plan.popular
                    ? "gradient-primary hover:opacity-90 text-white border-0 shadow-lg shadow-emerald-500/15"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/60"
                }`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Feature Comparison
          </h2>
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/60">
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-emerald-400">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {comparison.map((row) => (
                  <tr
                    key={row.feature}
                    className="hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm text-zinc-300">
                      {row.feature}
                    </td>
                    {(["free", "starter", "pro"] as const).map((plan) => (
                      <td
                        key={plan}
                        className="px-6 py-3.5 text-center text-sm"
                      >
                        {typeof row[plan] === "boolean" ? (
                          row[plan] ? (
                            <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-zinc-700">&mdash;</span>
                          )
                        ) : (
                          <span className="text-zinc-400">
                            {row[plan]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
