import { Navbar } from "@/components/layout/navbar";
import { Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "SendFast Refund Policy — 30-day money-back guarantee on all paid plans.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-noise">
      <div className="absolute inset-0 -z-10 bg-radial-top">
        <div className="bg-grid absolute inset-0" />
      </div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Refund Policy
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Refund Policy</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-300 [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-zinc-200">

          <p>
            We want you to be satisfied with SendFast. If you are not, we offer a straightforward
            refund process.
          </p>

          <h2>30-Day Money-Back Guarantee</h2>
          <p>
            If you are unhappy with any paid plan (Starter or Pro) for any reason, you may request
            a full refund within <strong>30 days</strong> of your initial purchase or renewal.
            No questions asked.
          </p>

          <h2>How to Request a Refund</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Email <a href="mailto:support@sendfast.app" className="text-emerald-400 hover:text-emerald-300">support@sendfast.app</a> with the subject line <strong>&quot;Refund Request&quot;</strong>.</li>
            <li>Include the email address on your account and your reason (optional).</li>
            <li>We will process the refund within <strong>5 business days</strong>.</li>
            <li>Refunds are returned to the original payment method.</li>
          </ol>

          <h2>Conditions</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Refund requests must be made within 30 days of the charge date.</li>
            <li>One refund per customer per 12-month period.</li>
            <li>After a refund, your account reverts to the Free plan immediately.</li>
            <li>We reserve the right to decline refunds for accounts found to be abusing the service.</li>
          </ul>

          <h2>Purchases via AI Agents</h2>
          <p>
            Subscriptions purchased via an AI agent (e.g. through ChatGPT&apos;s agentic commerce
            feature) are subject to the same 30-day refund policy. Contact us with your order
            confirmation email to initiate a refund.
          </p>

          <h2>Free Plan</h2>
          <p>
            The Free plan has no charge, so refunds do not apply.
          </p>

          <h2>Contact</h2>
          <p>
            Refund requests: <a href="mailto:support@sendfast.app" className="text-emerald-400 hover:text-emerald-300">support@sendfast.app</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex gap-6 text-sm text-zinc-500">
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
        </div>
      </main>
    </div>
  );
}
