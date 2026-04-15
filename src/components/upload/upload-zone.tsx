"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation,
  X,
  Copy,
  Check,
  Lock,
  Mail,
  Clock,
  Loader2,
  Link2,
  MessageSquare,
  Shield,
  Plus,
  ExternalLink,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEncryptionKey, encryptFile } from "@/lib/crypto";
import { formatBytes } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UploadResult {
  transferId: string;
  encryptionKey: string;
}

function getFileIconInfo(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type;

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

export function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [expiry, setExpiry] = useState("24h");
  const [password, setPassword] = useState("");
  const [emails, setEmails] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState<false | "password" | "email" | "more">(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [pageDragOver, setPageDragOver] = useState(false);
  const pageDragCounter = useRef(0);
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  // Full-page drag-and-drop: listen on document level
  useEffect(() => {
    if (result) return; // Don't listen when showing result

    const handlePageDragEnter = (e: DragEvent) => {
      e.preventDefault();
      pageDragCounter.current++;
      if (e.dataTransfer?.types.includes("Files")) {
        setPageDragOver(true);
      }
    };

    const handlePageDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handlePageDragLeave = (e: DragEvent) => {
      e.preventDefault();
      pageDragCounter.current--;
      if (pageDragCounter.current === 0) {
        setPageDragOver(false);
      }
    };

    const handlePageDrop = (e: DragEvent) => {
      e.preventDefault();
      pageDragCounter.current = 0;
      setPageDragOver(false);
      setDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer?.files || []);
      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
        setResult(null);
        // Scroll to upload zone
        document.getElementById("upload-zone")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    document.addEventListener("dragenter", handlePageDragEnter);
    document.addEventListener("dragover", handlePageDragOver);
    document.addEventListener("dragleave", handlePageDragLeave);
    document.addEventListener("drop", handlePageDrop);

    return () => {
      document.removeEventListener("dragenter", handlePageDragEnter);
      document.removeEventListener("dragover", handlePageDragOver);
      document.removeEventListener("dragleave", handlePageDragLeave);
      document.removeEventListener("drop", handlePageDrop);
    };
  }, [result]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setPageDragOver(false);
    pageDragCounter.current = 0;
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
      setResult(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      setResult(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (addFileInputRef.current) addFileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setProgressLabel("Generating encryption key...");

    try {
      const encryptionKey = await generateEncryptionKey();

      // Step 1 — encrypt all files in the browser
      const encrypted: { blob: Blob; iv: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgressLabel(`Encrypting ${files[i].name}...`);
        setProgress(Math.round((i / files.length) * 30));
        const arrayBuffer = await files[i].arrayBuffer();
        const result = await encryptFile(arrayBuffer, encryptionKey);
        encrypted.push({ blob: new Blob([result.encrypted]), iv: result.iv });
      }

      setProgress(35);
      setProgressLabel("Requesting upload URLs...");

      // Step 2 — ask server for presigned URLs (sends metadata only, no file data)
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: files.map((f, i) => ({
            name: f.name,
            size: f.size,
            type: f.type || "application/octet-stream",
            iv: encrypted[i].iv,
          })),
          expiry,
          ...(password && { password }),
          ...(emails && { emails }),
          ...(title && { title }),
          ...(message && { message }),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }

      const { transferId, presignedUrls } = await response.json();

      setProgress(40);
      setProgressLabel("Uploading encrypted files...");

      // Step 3 — upload encrypted files directly to MinIO via presigned URLs
      for (let i = 0; i < presignedUrls.length; i++) {
        const { url, index } = presignedUrls[i];
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/octet-stream" },
          body: encrypted[index].blob,
        });
        setProgress(40 + Math.round(((i + 1) / presignedUrls.length) * 55));
      }

      setProgress(100);
      setProgressLabel("Done!");
      setResult({ transferId, encryptionKey });

      toast({
        title: "Upload complete",
        description: "Your files have been encrypted and uploaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const shareUrl = result
    ? `${window.location.origin}/transfer/${result.transferId}#${result.encryptionKey}`
    : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetUpload = () => {
    setFiles([]);
    setResult(null);
    setProgress(0);
    setProgressLabel("");
    setPassword("");
    setEmails("");
    setTitle("");
    setMessage("");
    setShowOptions(false);
  };

  // ━━━ FULL-PAGE DROP OVERLAY ━━━
  const pageOverlay = pageDragOver && !result && (
    <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-float">
          <Upload className="h-10 w-10 text-white" />
        </div>
        <div>
          <p className="text-xl font-semibold text-white">Drop files anywhere</p>
          <p className="text-sm text-zinc-400 mt-1">They&apos;ll be encrypted in your browser</p>
        </div>
      </div>
    </div>
  );

  // ━━━ SUCCESS STATE ━━━
  if (result) {
    return (
      <div id="upload-zone" className="w-full max-w-2xl mx-auto animate-scale-in">
        <div className="rounded-2xl border border-emerald-500/20 bg-zinc-900/60 backdrop-blur-sm overflow-hidden">
          {/* Success header */}
          <div className="p-6 pb-5 text-center border-b border-zinc-800/40">
            <div className="mx-auto w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
              <Check className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Ready to share
            </h3>
            <p className="text-zinc-500 text-sm">
              {files.length} {files.length === 1 ? "file" : "files"} &middot; {formatBytes(totalSize)} &middot; Encrypted
            </p>
          </div>

          {/* Copy link */}
          <div className="p-5">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
              <Link2 className="h-4 w-4 text-emerald-400 shrink-0 ml-1" />
              <input
                readOnly
                value={shareUrl}
                className="text-sm text-zinc-300 bg-transparent flex-1 outline-none font-mono truncate"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                size="sm"
                onClick={copyLink}
                className={`shrink-0 h-8 px-3 text-xs font-medium transition-all ${
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                    : "gradient-primary text-white border-0"
                }`}
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5 mr-1" /> Copy link</>
                )}
              </Button>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 mt-3">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Open link
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={resetUpload}
                className="flex-1 h-9 text-xs border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New transfer
              </Button>
            </div>
          </div>

          {/* Security note */}
          <div className="px-5 pb-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-600">
            <Shield className="h-3 w-3 text-emerald-500/40" />
            Encryption key is in the URL fragment — never sent to our servers
          </div>
        </div>
      </div>
    );
  }

  // ━━━ EMPTY STATE — big inviting drop zone ━━━
  if (files.length === 0) {
    return (
      <div id="upload-zone" className="w-full max-w-2xl mx-auto">
        {pageOverlay}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10 md:p-16 text-center group ${
            dragOver
              ? "border-emerald-400 bg-emerald-500/[0.08] shadow-[0_0_80px_-20px_rgba(16,185,129,0.2)]"
              : "border-zinc-700/50 hover:border-zinc-500/50 bg-zinc-900/20 hover:bg-zinc-900/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="space-y-5">
            <div
              className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                dragOver
                  ? "gradient-primary shadow-lg shadow-emerald-500/25 scale-110"
                  : "bg-zinc-800/60 group-hover:bg-zinc-700/60 group-hover:scale-105"
              }`}
            >
              <Upload
                className={`h-7 w-7 transition-colors ${
                  dragOver ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"
                }`}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-200 mb-1">
                Drop files here or{" "}
                <span className="gradient-text font-semibold">browse</span>
              </p>
              <p className="text-sm text-zinc-500">
                Up to 2 GB free &middot; No account needed
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ━━━ FILES SELECTED — compact action panel ━━━
  return (
    <div id="upload-zone" className="w-full max-w-2xl mx-auto">
      {pageOverlay}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
        {/* File list */}
        <div className="divide-y divide-zinc-800/40 max-h-[240px] overflow-y-auto">
          {files.map((file, index) => {
            const fileInfo = getFileIconInfo(file);
            const Icon = fileInfo.icon;
            return (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/20 transition-colors group"
            >
              <div className={`w-8 h-8 rounded-lg ${fileInfo.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${fileInfo.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{file.name}</p>
                <p className="text-[11px] text-zinc-500">{formatBytes(file.size)}</p>
              </div>
              {!uploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            );
          })}
        </div>

        {/* Summary bar + add more */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800/40 bg-zinc-900/30">
          <span className="text-xs text-zinc-500">
            {files.length} {files.length === 1 ? "file" : "files"} &middot; {formatBytes(totalSize)}
          </span>
          {!uploading && (
            <button
              onClick={() => addFileInputRef.current?.click()}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"
            >
              <Plus className="h-3 w-3" />
              Add more
            </button>
          )}
          <input
            ref={addFileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Inline options row */}
        <div className="px-4 py-3 border-t border-zinc-800/40 bg-zinc-900/20">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Expiry selector */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger className="h-8 w-[110px] bg-zinc-800/40 border-zinc-700/40 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password toggle */}
            <button
              onClick={() => setShowOptions(showOptions === "password" ? false : "password")}
              className={`h-8 px-2.5 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
                password
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300 bg-zinc-800/40"
              }`}
            >
              <Lock className="h-3 w-3" />
              {password ? "Locked" : "Password"}
            </button>

            {/* Email toggle */}
            <button
              onClick={() => setShowOptions(showOptions === "email" ? false : "email")}
              className={`h-8 px-2.5 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
                emails
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300 bg-zinc-800/40"
              }`}
            >
              <Mail className="h-3 w-3" />
              Email
            </button>

            {/* More toggle */}
            <button
              onClick={() => setShowOptions(showOptions === "more" ? false : "more")}
              className={`h-8 px-2.5 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
                (title || message)
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : "border-zinc-700/40 text-zinc-500 hover:text-zinc-300 bg-zinc-800/40"
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              Message
            </button>
          </div>

          {/* Expanded option panels */}
          {showOptions === "password" && (
            <div className="mt-3 animate-fade-in">
              <Input
                type="password"
                placeholder="Enter a password to protect this transfer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800/40 border-zinc-700/40 text-sm h-9"
                autoFocus
              />
            </div>
          )}

          {showOptions === "email" && (
            <div className="mt-3 animate-fade-in">
              <Input
                type="text"
                placeholder="email@example.com (comma-separated for multiple)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="bg-zinc-800/40 border-zinc-700/40 text-sm h-9"
                autoFocus
              />
            </div>
          )}

          {showOptions === "more" && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <Input
                placeholder="Transfer title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800/40 border-zinc-700/40 text-sm h-9"
                autoFocus
              />
              <textarea
                placeholder="Add a message for the recipient (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-zinc-700/40 bg-zinc-800/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          )}
        </div>

        {/* Progress / Send button */}
        <div className="p-4 border-t border-zinc-800/40">
          {uploading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  {progressLabel}
                </span>
                <span className="text-emerald-400 font-semibold tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          ) : (
            <Button
              onClick={handleUpload}
              className="w-full h-11 gradient-primary hover:opacity-90 text-white border-0 font-semibold shadow-lg shadow-emerald-500/15 transition-all"
            >
              <Send className="h-4 w-4 mr-2" />
              Encrypt &amp; Send
              <span className="ml-1.5 text-white/70 font-normal">
                ({formatBytes(totalSize)})
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
