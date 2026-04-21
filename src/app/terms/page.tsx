import { Navbar } from "@/components/layout/navbar";
import { Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SendFast Terms of Service — rules for using our encrypted file transfer service.",
};

export default function TermsPage() {
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
            Terms of Service
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-300 [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-zinc-200">

          <p>
            By accessing or using SendFast (&quot;Service&quot;), you agree to these Terms of Service.
            If you do not agree, do not use the Service.
          </p>

          <h2>1. The Service</h2>
          <p>
            SendFast provides end-to-end encrypted file transfer. Files are encrypted in your browser
            before upload; we never access file contents. The Service is provided &quot;as is&quot;.
          </p>

          <h2>2. Accounts</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must be 13 or older to create an account.</li>
            <li>You are responsible for maintaining your account credentials.</li>
            <li>One account per person. Do not share accounts.</li>
            <li>We may terminate accounts that violate these Terms.</li>
          </ul>

          <h2>3. Acceptable Use</h2>
          <p>You may not use SendFast to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Transmit illegal content (child sexual abuse material, malware, etc.).</li>
            <li>Infringe intellectual property rights.</li>
            <li>Violate any applicable law or regulation.</li>
            <li>Attempt to circumvent our encryption, rate limits, or security measures.</li>
            <li>Resell or redistribute the Service without written permission.</li>
          </ul>
          <p>We reserve the right to remove content and suspend accounts at our sole discretion.</p>

          <h2>4. Plan Limits</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-2 text-zinc-300">Plan</th>
                <th className="text-left py-2 text-zinc-300">Transfer Size</th>
                <th className="text-left py-2 text-zinc-300">Expiry</th>
                <th className="text-left py-2 text-zinc-300">Monthly Transfers</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-800">
                <td className="py-2">Free</td><td className="py-2">2 GB</td><td className="py-2">7 days</td><td className="py-2">10</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2">Starter</td><td className="py-2">25 GB</td><td className="py-2">30 days</td><td className="py-2">100</td>
              </tr>
              <tr>
                <td className="py-2">Pro</td><td className="py-2">100 GB</td><td className="py-2">90 days</td><td className="py-2">500</td>
              </tr>
            </tbody>
          </table>
          <p>We may adjust limits with 30 days notice.</p>

          <h2>5. Payment and Subscriptions</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Paid plans are billed monthly via Stripe.</li>
            <li>Subscriptions renew automatically. Cancel any time in your dashboard.</li>
            <li>No refunds for partial months, except as stated in our <Link href="/refund" className="text-emerald-400 hover:text-emerald-300">Refund Policy</Link>.</li>
            <li>We may change prices with 30 days notice. Continued use constitutes acceptance.</li>
          </ul>

          <h2>6. Agentic Purchases</h2>
          <p>
            You may authorise an AI agent (e.g. via ChatGPT or a compatible agent platform) to purchase
            a SendFast subscription on your behalf using the Agentic Commerce Protocol. By doing so,
            you confirm you have authorised the agent and accept the resulting charge under these Terms.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            SendFast and its branding are our intellectual property. Your files remain yours — we claim
            no rights over content you transfer.
          </p>

          <h2>8. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE
            UPTIME OR DATA RETENTION BEYOND THE STATED EXPIRY PERIOD.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SENDFAST IS NOT LIABLE FOR INDIRECT, INCIDENTAL,
            OR CONSEQUENTIAL DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN
            THE LAST 3 MONTHS.
          </p>

          <h2>10. Governing Law</h2>
          <p>These Terms are governed by the laws of France.</p>

          <h2>11. Changes</h2>
          <p>
            We may update these Terms. Material changes will be notified 30 days in advance.
            Continued use constitutes acceptance.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions? Email <a href="mailto:legal@sendfast.app" className="text-emerald-400 hover:text-emerald-300">legal@sendfast.app</a>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex gap-6 text-sm text-zinc-500">
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
        </div>
      </main>
    </div>
  );
}
