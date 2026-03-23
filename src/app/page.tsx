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
  Sparkles,
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
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for speed with chunked uploads and parallel processing. Send gigabytes in seconds.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: Clock,
    title: "Expiring Links",
    description:
      "Set files to auto-delete after 1 hour, 24 hours, 7 days, or 30 days. You are in control.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Add an extra layer of security with password-protected transfers.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Mail,
    title: "Email Delivery",
    description:
      "Send download links directly to recipients via email with optional messages.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: BarChart3,
    title: "Download Tracking",
    description:
      "See who downloaded your files, when, and how many times. Stay informed.",
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-400",
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
    <div className="min-h-screen bg-noise">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden pt-24 pb-32 md:pt-36 md:pb-44"
      >
        {/* Animated background */}
        <div className="absolute inset-0 -z-10 bg-radial-top">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute top-40 left-1/4 w-[500px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[80px] animate-pulse-glow [animation-delay:1.5s]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-violet-500/[0.04] rounded-full blur-[60px] animate-pulse-glow [animation-delay:3s]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-1.5 text-sm text-emerald-300 mb-8 shimmer-bar">
              <Shield className="h-3.5 w-3.5" />
              <span className="font-medium">Zero-knowledge encryption</span>
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Send files fast.{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">Encrypted.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Upload, encrypt, and share files in seconds. Your files are
              encrypted in your browser before they ever leave your device.{" "}
              <span className="text-zinc-300 font-medium">We never see your data.</span>
            </p>
          </div>

          {/* Upload Zone */}
          <div className="animate-fade-in-up [animation-delay:200ms]">
            <UploadZone />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative border-y border-zinc-800/60 bg-zinc-900/20 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger-children">
            {[
              { icon: Shield, stat: "AES-256", label: "Military-grade encryption" },
              { icon: Globe, stat: "150+", label: "Countries served" },
              { icon: FileUp, stat: "10M+", label: "Files transferred" },
              { icon: Users, stat: "99.9%", label: "Uptime SLA" },
            ].map((item) => (
              <div key={item.stat} className="group">
                <div className="flex items-center justify-center gap-2.5 mb-2">
                  <item.icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-white">{item.stat}</span>
                </div>
                <p className="text-sm text-zinc-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-28 md:py-36">
        <div className="absolute inset-0 -z-10 bg-radial-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="gradient-text">send securely</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Built with security and speed at the core. No compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-7 hover:bg-zinc-900/50 transition-all duration-300 hover-glow shine"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
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
      <section className="relative py-28 md:py-36 border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Three simple steps. Your files never leave your browser unencrypted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto stagger-children">
            {[
              {
                step: "01",
                title: "Select your files",
                desc: "Drag and drop or browse to select any files. No size limits on paid plans.",
                gradient: "from-emerald-500 to-emerald-600",
              },
              {
                step: "02",
                title: "Encrypted in-browser",
                desc: "AES-256-GCM encryption happens locally. Your key never touches our servers.",
                gradient: "from-cyan-500 to-cyan-600",
              },
              {
                step: "03",
                title: "Share the link",
                desc: "Get a secure link with the decryption key embedded. Only your recipient can decrypt.",
                gradient: "from-violet-500 to-violet-600",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-zinc-700 to-transparent" />
                )}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} text-white font-bold text-lg mb-5 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform`}>
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
      <section id="pricing" className="relative py-28 md:py-36">
        <div className="absolute inset-0 -z-10 bg-radial-top" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-3">
              Pricing
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple, transparent{" "}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
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

                <div className="mb-7">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-5">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">
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
                      className="flex items-start gap-2.5 text-sm text-zinc-300"
                    >
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full h-11 font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "gradient-primary hover:opacity-90 text-white border-0 shadow-lg shadow-emerald-500/15"
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
      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="bg-grid absolute inset-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.06] rounded-full blur-[100px]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to send files <span className="gradient-text">securely</span>?
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
              No account needed. No software to install. Just drag, drop, and share.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#hero">
                <Button className="h-13 px-10 gradient-primary hover:opacity-90 text-white border-0 text-base font-semibold shadow-lg shadow-emerald-500/15">
                  Start Sending Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-13 px-10 border-zinc-700 text-zinc-300 hover:bg-zinc-800/80 text-base"
                >
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-14">
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
              <p className="text-sm text-zinc-500 leading-relaxed">
                Fast, encrypted file transfers with zero-knowledge security.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-300 mb-4">Product</h4>
              <ul className="space-y-2.5">
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
              <h4 className="text-sm font-semibold text-zinc-300 mb-4">Legal</h4>
              <ul className="space-y-2.5">
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
              <h4 className="text-sm font-semibold text-zinc-300 mb-4">Support</h4>
              <ul className="space-y-2.5">
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

          <div className="border-t border-zinc-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              &copy; {new Date().getFullYear()} SendFast. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <Shield className="h-3.5 w-3.5 text-emerald-500/50" />
              Protected by AES-256-GCM encryption
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
