import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/layout/toaster";

export const metadata: Metadata = {
  title: "SendFast - Fast, Encrypted File Transfer",
  description:
    "Send files instantly with end-to-end encryption. Zero-knowledge security means only you and your recipient can access your files. No sign-up required.",
  keywords: [
    "file transfer",
    "encrypted",
    "secure",
    "send files",
    "end-to-end encryption",
    "zero knowledge",
  ],
  openGraph: {
    title: "SendFast - Fast, Encrypted File Transfer",
    description:
      "Send files instantly with end-to-end encryption. Zero-knowledge security means only you and your recipient can access your files.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`${GeistSans.className} bg-background text-foreground antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
