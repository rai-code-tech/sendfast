"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileIcon,
  Download,
  Lock,
  Clock,
  Eye,
  AlertTriangle,
  Loader2,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptFile } from "@/lib/crypto";
import { formatBytes, formatDate } from "@/lib/utils";

interface TransferFile {
  id: string;
  name: string;
  size: number;
  type: string;
  iv: string;
  url: string;
}

interface TransferInfo {
  id: string;
  title: string | null;
  message: string | null;
  files: TransferFile[];
  expiresAt: string | null;
  downloadCount: number;
  passwordProtected: boolean;
  createdAt: string;
}

export default function TransferPage() {
  const params = useParams();
  const transferId = params.id as string;

  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [transfer, setTransfer] = useState<TransferInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const fetchTransfer = useCallback(async (pwd?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL(`/api/download/${transferId}`, window.location.origin);
      if (pwd) url.searchParams.set("password", pwd);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setNeedsPassword(true);
          if (pwd) setError("Incorrect password");
          return;
        }
        if (response.status === 410) {
          setError("This transfer has expired");
          return;
        }
        throw new Error(data.message || "Transfer not found");
      }

      setTransfer(data);
      setNeedsPassword(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transfer"
      );
    } finally {
      setLoading(false);
    }
  }, [transferId]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    setEncryptionKey(hash);
    fetchTransfer();
  }, [fetchTransfer]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransfer(password);
  };

  const downloadFile = async (file: TransferFile) => {
    if (!encryptionKey) {
      setError("No encryption key found in URL. The link may be incomplete.");
      return;
    }

    setDownloading(file.id);
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error("Failed to download file");

      const encryptedData = await response.arrayBuffer();
      const decryptedData = await decryptFile(encryptedData, encryptionKey, file.iv);

      const blob = new Blob([decryptedData], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to decrypt file. The link may be invalid."
      );
    } finally {
      setDownloading(null);
    }
  };

  const downloadAllFiles = async () => {
    if (!transfer) return;
    setDownloadingAll(true);
    for (const file of transfer.files) {
      await downloadFile(file);
    }
    setDownloadingAll(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noise">
        <div className="text-center space-y-4 animate-fade-in">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400 mx-auto" />
          <p className="text-zinc-400">Loading transfer...</p>
        </div>
      </div>
    );
  }

  // Error state (expired / not found)
  if (error && !needsPassword && !transfer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-noise">
        <div className="absolute inset-0 -z-10 bg-radial-top">
          <div className="bg-grid absolute inset-0" />
        </div>
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
            <p className="text-zinc-400">
              This transfer may have expired or the link is invalid.
            </p>
          </div>
          <Link href="/">
            <Button className="gradient-primary text-white border-0 shadow-lg shadow-emerald-500/15">
              Send your own files
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Password gate
  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-noise">
        <div className="absolute inset-0 -z-10 bg-radial-top">
          <div className="bg-grid absolute inset-0" />
        </div>
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-8 space-y-6 hover-glow">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-amber-400" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">
                Password Protected
              </h1>
              <p className="text-zinc-400 text-sm">
                This transfer is password protected. Enter the password to
                access the files.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-medium">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800/40 border-zinc-700/60 hover:border-zinc-600 transition-colors"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 py-1.5 px-3 rounded-lg">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-white border-0 shadow-lg shadow-emerald-500/15"
              >
                Unlock Files
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!transfer) return null;

  const totalSize = transfer.files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen bg-noise">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-radial-top">
        <div className="bg-grid absolute inset-0" />
      </div>

      {/* Minimal nav */}
      <nav className="border-b border-zinc-800/60 py-4 glass">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="gradient-primary rounded-lg p-1.5 shadow-lg shadow-emerald-500/10">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Send<span className="gradient-text">Fast</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            End-to-end encrypted
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20 animate-fade-in-up">
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden hover-glow">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-zinc-800/60">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {transfer.title || "File Transfer"}
                </h1>
                {transfer.message && (
                  <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                    {transfer.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5">
                <FileIcon className="h-4 w-4" />
                {transfer.files.length}{" "}
                {transfer.files.length === 1 ? "file" : "files"} (
                {formatBytes(totalSize)})
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {transfer.downloadCount}{" "}
                {transfer.downloadCount === 1 ? "download" : "downloads"}
              </div>
              {transfer.expiresAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Expires {formatDate(transfer.expiresAt)}
                </div>
              )}
            </div>
          </div>

          {/* File List */}
          <div className="divide-y divide-zinc-800/40">
            {transfer.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-4 md:px-8 hover:bg-zinc-800/20 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FileIcon className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate font-medium">{file.name}</p>
                  <p className="text-xs text-zinc-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadFile(file)}
                  disabled={downloading === file.id}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 opacity-70 group-hover:opacity-100 transition-all"
                >
                  {downloading === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Download All */}
          <div className="p-6 md:p-8 border-t border-zinc-800/60">
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}
            <Button
              onClick={downloadAllFiles}
              disabled={downloadingAll}
              className="w-full h-12 gradient-primary hover:opacity-90 text-white border-0 font-semibold shadow-lg shadow-emerald-500/15"
            >
              {downloadingAll ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Decrypting &amp; Downloading...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download All ({formatBytes(totalSize)})
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-600 mt-6">
          <Shield className="h-3.5 w-3.5 text-emerald-500/50" />
          Files are decrypted in your browser. The server never sees your data.
        </div>
      </div>
    </div>
  );
}
