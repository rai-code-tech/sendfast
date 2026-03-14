import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getExpiryDate(expiry: string): Date | null {
  const now = new Date();
  switch (expiry) {
    case "1h": return new Date(now.getTime() + 60 * 60 * 1000);
    case "24h": return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case "7d": return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "30d": return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case "never": return null;
    default: return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}

export function isExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > new Date(expiresAt);
}
