import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/layout/toaster";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
