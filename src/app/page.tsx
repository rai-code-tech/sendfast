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
    title: "End-to-End Encrypted",
    description:
      "AES-256-GCM encryption in your browser. We never see your files.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Chunked uploads with parallel processing. Gigabytes in seconds.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: Clock,
    title: "Auto-Expiring Links",
    description:
      "Files auto-delete after 1h, 24h, 7 days, or 30 days.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Add passwords for an extra layer of security on transfers.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Mail,
    title: "Email Delivery",
    description:
      "Send download links directly to recipients with a message.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: BarChart3,
    title: "Download Tracking",
    description:
      "See who downloaded, when, and how many times.",
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-400",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Quick, one-off transfers",
    features: [
      "500 MB per transfer",
      "24-hour expiry",
      "5 transfers per day",
      "End-to-end encryption",
    ],
    cta: "Start Sending",
    href: "/#hero",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "mo",
    description: "For professionals",
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
    period: "mo",
    description: "For teams & power users",
    features: [
      "Unlimited file size",
      "Custom expiry",
      "Everything in Starter",
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

      {/* ────────── HERO: The product IS the landing page ────────── */}
      <section
        id="hero"
        className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28"
      >
        {/* Ambient background */}
        <div className="absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[80px] animate-pulse-glow [animation-delay:2s]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact headline */}
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-[1.1]">
              Send files.{" "}
              <span className="gradient-text">Encrypted.</span>
            </h1>
            <p className="text-base md:text-lg text-zinc-400 max-w-lg mx-auto">
              Drop your files below. They&apos;re encrypted in your browser before upload.
              No account needed.
            </p>
          </div>

          {/* THE UPLOAD ZONE — the star of the page */}
          <div className="animate-fade-in-up [animation-delay:150ms]">
            <UploadZone />
          </div>

          {/* Inline trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-zinc-500 animate-fade-in [animation-delay:400ms]">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400/70" />
              AES-256-GCM
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-400/70" />
              Zero-knowledge
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400/70" />
              No account required
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400/70" />
              Auto-expiring links
            </span>
          </div>
        </div>
      </section>

      {/* ────────── SOCIAL PROOF BAR ────────── */}
      <section className="border-y border-zinc-800/40 bg-zinc-900/20 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, stat: "AES-256", label: "Military-grade" },
              { icon: Globe, stat: "150+", label: "Countries" },
              { icon: FileUp, stat: "10M+", label: "Files sent" },
              { icon: Users, stat: "99.9%", label: "Uptime" },
            ].map((item) => (
              <div key={item.stat}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <item.icon className="h-4 w-4 text-emerald-400" />
                  <span className="text-xl font-bold text-white">{item.stat}</span>
                </div>
                <p className="text-xs text-zinc-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── HOW IT WORKS — compact ────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            How it <span className="gradient-text">works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Drop your files",
                desc: "Drag and drop or browse. Any file type, any size on paid plans.",
                gradient: "from-emerald-500 to-emerald-600",
              },
              {
                step: "2",
                title: "Encrypted in-browser",
                desc: "AES-256-GCM encryption happens locally. Your key never leaves your device.",
                gradient: "from-cyan-500 to-cyan-600",
              },
              {
                step: "3",
                title: "Share the link",
                desc: "Copy the link. The decryption key is in the URL — our server never sees it.",
                gradient: "from-violet-500 to-violet-600",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative flex gap-4 md:flex-col md:text-center md:items-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-gradient-to-r from-zinc-700 to-transparent" />
                )}
                <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} text-white font-bold text-sm flex items-center justify-center shadow-lg`}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── FEATURES — compact grid ────────── */}
      <section id="features" className="relative py-20 md:py-28 border-t border-zinc-800/40">
        <div className="absolute inset-0 -z-10 bg-radial-center" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Everything you need to{" "}
            <span className="gradient-text">send securely</span>
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-lg mx-auto">
            Security and speed. No compromises.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 hover:bg-zinc-900/50 transition-all duration-200 hover-glow"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-4.5 w-4.5 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── PRICING — compact ────────── */}
      <section id="pricing" className="relative py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Simple <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-md mx-auto">
            Start free. Upgrade when you need more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 ${
                  plan.popular
                    ? "border border-emerald-500/40 bg-zinc-900/60 popular-ring"
                    : "border border-zinc-800/50 bg-zinc-900/30 hover-glow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 mb-3">{plan.description}</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-xs">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full h-10 text-sm font-semibold ${
                      plan.popular
                        ? "gradient-primary hover:opacity-90 text-white border-0 shadow-lg shadow-emerald-500/15"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── FINAL CTA ────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/[0.06] rounded-full blur-[100px]" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Ready to send files <span className="gradient-text">securely</span>?
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
              No account needed. Just drag, drop, and share.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/#hero">
                <Button className="h-11 px-8 gradient-primary hover:opacity-90 text-white border-0 font-semibold shadow-lg shadow-emerald-500/15">
                  Start Sending Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-11 px-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800/80">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── FOOTER ────────── */}
      <footer className="border-t border-zinc-800/40 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="gradient-primary rounded-lg p-1">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">
                Send<span className="gradient-text">Fast</span>
              </span>
            </Link>

            <div className="flex items-center gap-6 text-xs text-zinc-500">
              <Link href="/#features" className="hover:text-zinc-300 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
              <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <Shield className="h-3 w-3 text-emerald-500/50" />
              AES-256-GCM encrypted
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
