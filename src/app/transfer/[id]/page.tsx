"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation,
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
  Fingerprint,
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

function getFileIconInfo(name: string, mime: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";

  if (mime.startsWith("image/"))
    return { icon: FileImage, color: "text-pink-400", bg: "bg-pink-500/10" };
  if (mime.startsWith("video/"))
    return { icon: FileVideo, color: "text-purple-400", bg: "bg-purple-500/10" };
  if (mime.startsWith("audio/"))
    return { icon: FileAudio, color: "text-orange-400", bg: "bg-orange-500/10" };
  if (mime === "application/pdf" || ext === "pdf")
    return { icon: FileText, color: "text-red-400", bg: "bg-red-500/10" };
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext))
    return { icon: FileArchive, color: "text-amber-400", bg: "bg-amber-500/10" };
  if (["doc", "docx", "txt", "rtf", "odt", "md"].includes(ext))
    return { icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" };
  if (["xls", "xlsx", "csv", "ods"].includes(ext))
    return { icon: FileSpreadsheet, color: "text-green-400", bg: "bg-green-500/10" };
  if (["ppt", "pptx", "key", "odp"].includes(ext))
    return { icon: Presentation, color: "text-orange-400", bg: "bg-orange-500/10" };
  if (["js", "ts", "py", "rb", "go", "rs", "java", "cpp", "c", "h", "html", "css", "json", "xml", "yaml", "yml", "sh"].includes(ext))
    return { icon: FileCode, color: "text-cyan-400", bg: "bg-cyan-500/10" };

  return { icon: FileIcon, color: "text-emerald-400", bg: "bg-emerald-500/10" };
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
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

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
      setDownloaded((prev) => new Set(prev).add(file.id));
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
        <div className="absolute inset-0 -z-10 bg-radial-top">
          <div className="bg-grid absolute inset-0" />
        </div>
        <div className="text-center space-y-4 animate-fade-in">
          <div className="mx-auto w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>
          <div>
            <p className="text-zinc-300 font-medium">Loading transfer</p>
            <p className="text-zinc-500 text-sm mt-1">Verifying encryption...</p>
          </div>
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
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
            <p className="text-zinc-400 text-sm">
              This transfer may have expired or the link is invalid.
            </p>
          </div>
          <Link href="/">
            <Button className="gradient-primary text-white border-0 shadow-lg shadow-emerald-500/15 h-11 px-6">
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
              <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
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
                  className="bg-zinc-800/40 border-zinc-700/60 hover:border-zinc-600 transition-colors h-11"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 py-1.5 px-3 rounded-lg">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 gradient-primary text-white border-0 shadow-lg shadow-emerald-500/15 font-semibold"
              >
                <Lock className="h-4 w-4 mr-2" />
                Unlock Files
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600 mt-4">
            <Shield className="h-3 w-3 text-emerald-500/40" />
            Files are encrypted end-to-end
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
            <div className="gradient-primary rounded-lg p-1.5 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition-shadow">
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
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-full font-medium border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <FileIcon className="h-3.5 w-3.5" />
                {transfer.files.length}{" "}
                {transfer.files.length === 1 ? "file" : "files"} &middot;{" "}
                {formatBytes(totalSize)}
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {transfer.downloadCount}{" "}
                {transfer.downloadCount === 1 ? "download" : "downloads"}
              </div>
              {transfer.expiresAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Expires {formatDate(transfer.expiresAt)}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Fingerprint className="h-3.5 w-3.5 text-emerald-500/70" />
                <span className="text-emerald-500/70">E2E Encrypted</span>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="divide-y divide-zinc-800/40">
            {transfer.files.map((file) => {
              const fileInfo = getFileIconInfo(file.name, file.type);
              const Icon = fileInfo.icon;
              const isDownloaded = downloaded.has(file.id);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-4 md:px-8 hover:bg-zinc-800/20 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg ${fileInfo.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${fileInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate font-medium">{file.name}</p>
                    <p className="text-xs text-zinc-500">
                      {formatBytes(file.size)}
                      {isDownloaded && (
                        <span className="text-emerald-500 ml-2">
                          <CheckCircle2 className="h-3 w-3 inline mr-0.5" />
                          Downloaded
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadFile(file)}
                    disabled={downloading === file.id}
                    className={`transition-all ${
                      isDownloaded
                        ? "text-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10"
                        : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 opacity-70 group-hover:opacity-100"
                    }`}
                  >
                    {downloading === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
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

        {/* Powered by + security */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
            <Shield className="h-3 w-3 text-emerald-500/40" />
            Files are decrypted in your browser. The server never sees your data.
          </div>
          <Link href="/" className="group flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
            Powered by
            <span className="font-semibold text-zinc-500 group-hover:text-white transition-colors">
              Send<span className="gradient-text">Fast</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
