import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "SendFast pricing plans. Free tier with 2 GB transfers. Starter at $9/mo for 25 GB. Pro at $19/mo for 100 GB with API access and custom branding.",
  openGraph: {
    title: "SendFast Pricing - Simple, Transparent Plans",
    description:
      "Start free with 2 GB transfers. Upgrade to Starter ($9/mo) or Pro ($19/mo) for more storage, longer expiry, and premium features.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
