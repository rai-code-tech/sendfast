import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/layout/toaster";

export const metadata: Metadata = {
  title: {
    default: "SendFast - Fast, Encrypted File Transfer",
    template: "%s | SendFast",
  },
  description:
    "Send files instantly with end-to-end encryption. AES-256-GCM encryption in your browser. Zero-knowledge — we never see your files. No account required. Up to 2 GB free.",
  keywords: [
    "file transfer",
    "encrypted file sharing",
    "secure file transfer",
    "send large files",
    "end-to-end encryption",
    "zero knowledge",
    "AES-256",
    "password protected file sharing",
    "encrypted upload",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sendfast.app"),
  openGraph: {
    title: "SendFast - Send Files. Fast. Encrypted.",
    description:
      "End-to-end encrypted file transfer. AES-256-GCM encryption happens in your browser — we never see your files. No account required.",
    type: "website",
    siteName: "SendFast",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SendFast - Send Files. Fast. Encrypted.",
    description:
      "End-to-end encrypted file transfer. Zero-knowledge security. No account required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "SendFast",
      url: "https://sendfast.app",
      description:
        "End-to-end encrypted file transfer service. AES-256-GCM encryption in your browser. Zero-knowledge architecture.",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          description: "2 GB per transfer, 7-day expiry, 10 transfers/month",
        },
        {
          "@type": "Offer",
          name: "Starter",
          price: "9",
          priceCurrency: "USD",
          billingIncrement: "month",
          description: "25 GB per transfer, 30-day expiry, 100 transfers/month",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "19",
          priceCurrency: "USD",
          billingIncrement: "month",
          description: "100 GB per transfer, 90-day expiry, 500 transfers/month, API access",
        },
      ],
      featureList: [
        "AES-256-GCM end-to-end encryption",
        "Zero-knowledge architecture",
        "No account required",
        "Password protection",
        "Auto-expiring links",
        "Download tracking",
        "Email delivery",
        "REST API access",
        "Custom branding",
      ],
    },
    {
      "@type": "Organization",
      name: "SendFast",
      url: "https://sendfast.app",
      description: "Fast, encrypted file transfer service with zero-knowledge security.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`${GeistSans.className} bg-background text-foreground antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
