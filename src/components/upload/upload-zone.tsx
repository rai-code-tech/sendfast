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
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [result, setResult] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const encryptionKey = await generateEncryptionKey();
      const formData = new FormData();

      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
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

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(90);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      setProgress(100);
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
    setPassword("");
    setEmails("");
    setTitle("");
    setMessage("");
    setShowOptions(false);
  };

  // Success state
  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <Check className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Files encrypted &amp; uploaded
            </h3>
            <p className="text-zinc-400 text-sm">
              Share this link with your recipient. The encryption key is in the
              URL and never sent to our servers.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <Link2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <code className="text-sm text-zinc-300 truncate flex-1 text-left">
              {shareUrl}
            </code>
            <Button
              size="sm"
              onClick={copyLink}
              className={
                copied
                  ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                  : "gradient-primary text-white border-0"
              }
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </>
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={resetUpload}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Send another file
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 md:p-12 text-center group ${
          dragOver
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/30 hover:bg-zinc-900/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-4">
          <div
            className={`mx-auto w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
              dragOver
                ? "gradient-primary"
                : "bg-zinc-800 group-hover:bg-zinc-700"
            }`}
          >
            <Upload
              className={`h-7 w-7 ${
                dragOver ? "text-white" : "text-zinc-400"
              }`}
            />
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-200">
              Drop files here or{" "}
              <span className="gradient-text font-semibold">browse</span>
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Files are encrypted in your browser before upload
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3"
              >
                <FileIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Options Toggle */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            {showOptions ? "Hide options" : "More options"}
            <ChevronIcon open={showOptions} />
          </button>

          {/* Options Panel */}
          {showOptions && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Expiry */}
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Expires after
                  </Label>
                  <Select value={expiry} onValueChange={setExpiry}>
                    <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="never">Never (paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Password (optional)
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5" />
                  Title (optional)
                </Label>
                <Input
                  placeholder="Transfer title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message (optional)
                </Label>
                <textarea
                  placeholder="Add a message for the recipient"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="flex w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Recipient Emails */}
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email recipients (optional)
                </Label>
                <Input
                  placeholder="email@example.com, another@example.com"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700"
                />
                <p className="text-xs text-zinc-500">
                  Comma-separated emails to notify when upload is ready
                </p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Encrypting &amp; uploading...</span>
                <span className="text-emerald-400 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="w-full h-12 gradient-primary hover:opacity-90 text-white border-0 text-base font-semibold"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Encrypting &amp; Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Encrypt &amp; Send {files.length}{" "}
                {files.length === 1 ? "file" : "files"}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
