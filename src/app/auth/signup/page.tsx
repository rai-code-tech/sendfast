"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, Mail, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>}>
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to create account");
      }

      router.push(plan ? `/pricing` : "/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    authClient.signIn.social({
      provider: "google",
      callbackURL: plan ? "/pricing" : "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-noise">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-radial-top">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-[100px] animate-pulse-glow" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="gradient-primary rounded-lg p-2 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition-shadow">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Send<span className="gradient-text">Fast</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-zinc-400 mt-1.5">
            {plan
              ? `Get started with the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`
              : "Start sending encrypted files for free"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-6 md:p-8 space-y-6 hover-glow">
          {/* Google Sign Up */}
          <Button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            variant="outline"
            className="w-full h-11 border-zinc-700/60 bg-zinc-800/40 hover:bg-zinc-800/80 text-white transition-all"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900/80 px-3 text-zinc-500">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs font-medium">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800/40 border-zinc-700/60 pl-10 hover:border-zinc-600 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800/40 border-zinc-700/60 pl-10 hover:border-zinc-600 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs font-medium">Password</Label>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800/40 border-zinc-700/60 hover:border-zinc-600 transition-colors"
                required
                minLength={8}
              />
              <p className="text-xs text-zinc-600">
                Must be at least 8 characters
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gradient-primary hover:opacity-90 text-white border-0 font-semibold shadow-lg shadow-emerald-500/15"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-between mt-6 px-1">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Shield className="h-3 w-3 text-emerald-500/50" />
            Secured
          </div>
        </div>
      </div>
    </div>
  );
}
