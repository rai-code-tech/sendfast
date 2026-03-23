"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import {
  Zap,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="gradient-primary rounded-lg p-1.5 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition-shadow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Send<span className="gradient-text">Fast</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Pricing
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white font-medium text-sm shadow-md shadow-emerald-500/10">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-2xl z-20 py-1.5 animate-scale-in">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors rounded-lg mx-1"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <div className="border-t border-zinc-800 my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors w-full rounded-lg mx-1"
                        style={{ width: "calc(100% - 0.5rem)" }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="gradient-primary hover:opacity-90 text-white border-0 shadow-md shadow-emerald-500/10"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl animate-fade-in-down">
          <div className="px-4 py-5 space-y-1">
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-zinc-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-zinc-800/50"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-zinc-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-zinc-800/50"
            >
              Pricing
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-zinc-800/50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-zinc-800/50 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-zinc-800/60">
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full text-zinc-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gradient-primary text-white border-0 shadow-md shadow-emerald-500/10">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
