"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileIcon,
  Trash2,
  ExternalLink,
  Loader2,
  Upload,
  Clock,
  HardDrive,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { formatBytes, formatDate, isExpired } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Transfer {
  id: string;
  title: string | null;
  fileCount: number;
  totalSize: number;
  downloadCount: number;
  expiresAt: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [isPending, session, router]);

  const fetchTransfers = useCallback(async () => {
    try {
      const response = await fetch("/api/transfers");
      if (response.ok) {
        const data = await response.json();
        setTransfers(data.transfers);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load transfers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session) {
      fetchTransfers();
    }
  }, [session, fetchTransfers]);

  const deleteTransfer = async (id: string) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/transfers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTransfers((prev) => prev.filter((t) => t.id !== id));
        toast({
          title: "Transfer deleted",
          description: "The transfer and all its files have been removed.",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete transfer",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const activeTransfers = transfers.filter(
    (t) => !isExpired(t.expiresAt ? new Date(t.expiresAt) : null)
  );
  const totalStorage = transfers.reduce((sum, t) => sum + t.totalSize, 0);
  const totalDownloads = transfers.reduce((sum, t) => sum + t.downloadCount, 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">
              Welcome back, {session?.user?.name || "there"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300"
              >
                <ArrowUpRight className="h-4 w-4 mr-1.5" />
                Upgrade Plan
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="sm"
                className="gradient-primary text-white border-0"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                New Transfer
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FileIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {activeTransfers.length}
                </p>
                <p className="text-xs text-zinc-500">Active Transfers</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatBytes(totalStorage)}
                </p>
                <p className="text-xs text-zinc-500">Storage Used</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {totalDownloads}
                </p>
                <p className="text-xs text-zinc-500">Total Downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transfers Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">
              Transfer History
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
            </div>
          ) : transfers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                <Upload className="h-7 w-7 text-zinc-500" />
              </div>
              <p className="text-zinc-400 mb-2">No transfers yet</p>
              <p className="text-sm text-zinc-600">
                Upload your first file to get started
              </p>
              <Link href="/">
                <Button className="mt-4 gradient-primary text-white border-0">
                  Send Files
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Transfer
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Files
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {transfers.map((transfer) => {
                    const expired = isExpired(
                      transfer.expiresAt
                        ? new Date(transfer.expiresAt)
                        : null
                    );
                    return (
                      <tr
                        key={transfer.id}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm text-zinc-200 font-medium truncate max-w-[200px]">
                            {transfer.title || transfer.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-zinc-600 font-mono">
                            {transfer.id.slice(0, 12)}...
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {transfer.fileCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {formatBytes(transfer.totalSize)}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {transfer.downloadCount}
                        </td>
                        <td className="px-6 py-4">
                          {expired ? (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                              <AlertCircle className="h-3 w-3" />
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          {formatDate(transfer.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {!expired && (
                              <Link
                                href={`/transfer/${transfer.id}`}
                                target="_blank"
                              >
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-zinc-500 hover:text-zinc-300"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteTransfer(transfer.id)}
                              disabled={deleting === transfer.id}
                              className="h-8 w-8 text-zinc-500 hover:text-red-400"
                            >
                              {deleting === transfer.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
