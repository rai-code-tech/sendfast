import { Navbar } from "@/components/layout/navbar";
import { Shield, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SendFast Privacy Policy — how we handle your data with zero-knowledge architecture.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-300 [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-zinc-200">

          <p>
            SendFast (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates <strong>sendfast.app</strong> and
            associated domains. This Privacy Policy explains how we collect, use, and protect your information.
          </p>

          <h2>Zero-Knowledge Architecture</h2>
          <p>
            SendFast is built on a zero-knowledge model. All files are encrypted client-side using
            AES-256-GCM <em>before</em> they are uploaded. The encryption key is embedded in the URL
            fragment (<code>#key=…</code>) and is never transmitted to our servers. <strong>We cannot
            read your files.</strong>
          </p>

          <h2>Information We Collect</h2>
          <p>We collect the minimum necessary to operate the service:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account data</strong> — name and email address when you sign up.</li>
            <li><strong>Transfer metadata</strong> — file name, size, MIME type, expiry date, download count. Not file content.</li>
            <li><strong>Usage data</strong> — pages visited, features used (via privacy-preserving analytics).</li>
            <li><strong>Payment data</strong> — handled entirely by Stripe. We store only your Stripe customer ID and subscription status.</li>
            <li><strong>IP addresses</strong> — retained briefly for abuse prevention, not linked to transfers.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Deliver the file transfer service and manage your account.</li>
            <li>Process payments and manage subscriptions via Stripe.</li>
            <li>Send transactional emails (transfer notifications, receipts).</li>
            <li>Prevent abuse, fraud, and illegal use.</li>
            <li>Improve the service through aggregate, anonymised analytics.</li>
          </ul>

          <h2>Data Storage and Retention</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encrypted files are stored on our servers for the duration of the transfer expiry (7 days free, up to 90 days Pro), then permanently deleted.</li>
            <li>Transfer metadata is retained for 12 months for billing and audit purposes, then deleted.</li>
            <li>Account data is retained while your account is active. You may request deletion at any time.</li>
          </ul>

          <h2>Third-Party Services</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Stripe</strong> — payment processing. Subject to <a href="https://stripe.com/privacy" className="text-emerald-400 hover:text-emerald-300">Stripe&apos;s Privacy Policy</a>.</li>
            <li><strong>MinIO / S3-compatible storage</strong> — encrypted file storage hosted on our infrastructure.</li>
            <li><strong>OpenPanel</strong> — privacy-preserving, cookieless analytics. No personal data shared.</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use only essential session cookies for authentication. We do not use advertising or
            tracking cookies.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Export your data in a machine-readable format.</li>
            <li>Withdraw consent at any time.</li>
          </ul>
          <p>To exercise these rights, email us at <a href="mailto:privacy@sendfast.app" className="text-emerald-400 hover:text-emerald-300">privacy@sendfast.app</a>.</p>

          <h2>Data Transfers</h2>
          <p>
            SendFast operates servers within the EU/EEA. If you access the service from outside the EU,
            your data may be transferred internationally. We rely on Standard Contractual Clauses where
            required by GDPR.
          </p>

          <h2>Children</h2>
          <p>SendFast is not directed at children under 13. We do not knowingly collect data from children.</p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy. Material changes will be notified by email or a prominent notice
            on the site. Continued use after changes constitutes acceptance.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? Email <a href="mailto:privacy@sendfast.app" className="text-emerald-400 hover:text-emerald-300">privacy@sendfast.app</a>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex gap-6 text-sm text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          <Link href="/refund" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
        </div>
      </main>
    </div>
  );
}
