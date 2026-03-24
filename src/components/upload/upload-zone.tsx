"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileIcon,
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

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

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
      const formData = new FormData();

      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        setProgressLabel(`Encrypting ${file.name}...`);
        setProgress(Math.round(((i) / totalFiles) * 50));

        const arrayBuffer = await file.arrayBuffer();
        const { encrypted, iv } = await encryptFile(arrayBuffer, encryptionKey);

        const encryptedBlob = new Blob([encrypted]);
        formData.append("files", encryptedBlob, file.name);
        formData.append("ivs", iv);
        formData.append("sizes", file.size.toString());
        formData.append("types", file.type || "application/octet-stream");
      }

      formData.append("expiry", expiry);
      if (password) formData.append("password", password);
      if (emails) formData.append("emails", emails);
      if (title) formData.append("title", title);
      if (message) formData.append("message", message);

      setProgress(60);
      setProgressLabel("Uploading encrypted files...");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(90);
      setProgressLabel("Finalizing...");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      setProgress(100);
      setProgressLabel("Done!");
      setResult({
        transferId: data.transferId,
        encryptionKey,
      });

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

  // ━━━ SUCCESS STATE ━━━
  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-scale-in">
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
      <div className="w-full max-w-2xl mx-auto">
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
                Up to 500 MB free &middot; No account needed
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ━━━ FILES SELECTED — compact action panel ━━━
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
        {/* File list */}
        <div className="divide-y divide-zinc-800/40 max-h-[240px] overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/20 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <FileIcon className="h-4 w-4 text-emerald-400" />
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
          ))}
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
