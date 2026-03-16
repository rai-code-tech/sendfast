import {
  Shield,
  Zap,
  Clock,
  Lock,
  Mail,
  BarChart3,
  Check,
  ArrowRight,
  Globe,
  Users,
  FileUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { UploadZone } from "@/components/upload/upload-zone";

const features = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description:
      "AES-256-GCM encryption happens in your browser. We never see your files or encryption keys.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for speed with chunked uploads and parallel processing. Send gigabytes in seconds.",
  },
  {
    icon: Clock,
    title: "Expiring Links",
    description:
      "Set files to auto-delete after 1 hour, 24 hours, 7 days, or 30 days. You are in control.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Add an extra layer of security with password-protected transfers.",
  },
  {
    icon: Mail,
    title: "Email Delivery",
    description:
      "Send download links directly to recipients via email with optional messages.",
  },
  {
    icon: BarChart3,
    title: "Download Tracking",
    description:
      "See who downloaded your files, when, and how many times. Stay informed.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for quick, one-off transfers",
    features: [
      "500 MB per transfer",
      "24-hour expiry",
      "5 transfers per day",
      "End-to-end encryption",
      "Shareable links",
    ],
    cta: "Start Sending",
    href: "/#hero",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "per month",
    description: "For professionals who send files regularly",
    features: [
      "5 GB per transfer",
      "30-day expiry",
      "Unlimited transfers",
      "Password protection",
      "Email delivery",
      "Download tracking",
    ],
    cta: "Get Starter",
    href: "/auth/signup?plan=starter",
    popular: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For teams and power users",
    features: [
      "Unlimited file size",
      "Custom expiry (or never)",
      "Unlimited transfers",
      "Everything in Starter",
      "Priority support",
      "API access",
      "Custom branding",
    ],
    cta: "Get Pro",
    href: "/auth/signup?plan=pro",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-40"
      >
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 mb-8">
              <Shield className="h-4 w-4 text-emerald-400" />
              Zero-knowledge encryption
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Send files fast.{" "}
              <span className="gradient-text">Encrypted.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Upload, encrypt, and share files in seconds. Your files are
              encrypted in your browser before they ever leave your device. We
              never see your data.
            </p>
          </div>

          {/* Upload Zone right in the hero */}
          <UploadZone />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">AES-256</span>
              </div>
              <p className="text-sm text-zinc-500">Military-grade encryption</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">150+</span>
              </div>
              <p className="text-sm text-zinc-500">Countries served</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileUp className="h-5 w-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">10M+</span>
              </div>
              <p className="text-sm text-zinc-500">Files transferred</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">99.9%</span>
              </div>
              <p className="text-sm text-zinc-500">Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="gradient-text">send securely</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Built with security and speed at the core. No compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Three simple steps. Your files never leave your browser unencrypted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Select your files",
                desc: "Drag and drop or browse to select any files. No size limits on paid plans.",
              },
              {
                step: "02",
                title: "Encrypted in-browser",
                desc: "AES-256-GCM encryption happens locally. Your key never touches our servers.",
              },
              {
                step: "03",
                title: "Share the link",
                desc: "Get a secure link with the decryption key embedded. Only your recipient can decrypt.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, transparent{" "}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  plan.popular
                    ? "border-emerald-500/50 bg-zinc-900/60 shadow-lg shadow-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500 text-sm">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "gradient-primary hover:opacity-90 text-white border-0"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to send files <span className="gradient-text">securely</span>?
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
              No account needed. No software to install. Just drag, drop, and share.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#hero">
                <Button className="h-12 px-8 gradient-primary hover:opacity-90 text-white border-0 text-base font-semibold">
                  Start Sending Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-12 px-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-base"
                >
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="gradient-primary rounded-lg p-1.5">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Send<span className="gradient-text">Fast</span>
                </span>
              </Link>
              <p className="text-sm text-zinc-500">
                Fast, encrypted file transfers with zero-knowledge security.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#features"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8 text-center">
            <p className="text-sm text-zinc-600">
              &copy; {new Date().getFullYear()} SendFast. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
