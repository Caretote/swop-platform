"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Eye, EyeOff, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("michael.jones@acmecorp.com");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1200));
    if (password.length < 1) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm px-4"
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center mb-4">
          <Brain className="w-7 h-7 text-[#60A5FA]" />
        </div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          SWOP Intelligence
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">by Michael Jones</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
        <h2 className="text-base font-semibold text-white mb-5">Sign in to your workspace</h2>

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 placeholder:text-[#94A3B8]/40"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#94A3B8] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#F87171]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2 justify-center">
          <button className="text-xs text-[#60A5FA] hover:underline">Forgot password?</button>
          <span className="text-[#94A3B8]/30">·</span>
          <button className="text-xs text-[#60A5FA] hover:underline">SSO Login</button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-6">
        <Shield className="w-3 h-3 text-[#94A3B8]/40" />
        <p className="text-[11px] text-[#94A3B8]/40">Enterprise-grade security · SOC 2 Type II</p>
      </div>
    </motion.div>
  );
}
