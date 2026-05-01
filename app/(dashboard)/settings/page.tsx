"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Key, Database, Palette, Shield,
  Check, Eye, EyeOff, RefreshCw, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
  { id: "data", label: "Data & Privacy", icon: Database },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Settings</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Manage your SWOP platform configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar nav */}
        <div className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                active === s.id
                  ? "bg-[#2563EB]/15 text-white border border-[#2563EB]/25"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              )}
            >
              <s.icon className="w-4 h-4 shrink-0" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {active === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/8 p-6 space-y-5" style={{ background: "var(--swop-card)" }}>
              <h2 className="text-sm font-semibold text-white">Profile Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "First Name", defaultValue: "Michael" },
                  { label: "Last Name", defaultValue: "Jones" },
                  { label: "Email", defaultValue: "michael.jones@acmecorp.com" },
                  { label: "Title", defaultValue: "Chief People Officer" },
                  { label: "Organization", defaultValue: "MJ Corp" },
                  { label: "Time Zone", defaultValue: "America/New_York" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs text-[#94A3B8] mb-1.5">{f.label}</label>
                    <input defaultValue={f.defaultValue}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={save}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1d4ed8] transition-colors">
                  {saved ? <><Check className="w-4 h-4" /> Saved</> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          )}

          {active === "api" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
                <h2 className="text-sm font-semibold text-white mb-4">Anthropic API Key</h2>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? "text" : "password"}
                      defaultValue="sk-ant-api03-••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 font-mono pr-10"
                    />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white">
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Rotate
                  </button>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">Used by all SWOP AI agents. Stored encrypted.</p>
              </div>

              <div className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
                <h2 className="text-sm font-semibold text-white mb-4">AI Model Configuration</h2>
                <div className="space-y-3">
                  {[
                    { label: "Primary Model", value: "claude-opus-4-5 (Highest capability)", note: "Used for plan review, collaboration analysis, deep think" },
                    { label: "Fast Model", value: "claude-haiku-4-5 (Fastest)", note: "Used for streaming copilot, quick completions" },
                    { label: "Deep Think Budget", value: "8,000 tokens", note: "Extended thinking budget for complex reasoning" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-start justify-between gap-4 py-3 border-b border-white/6 last:border-0">
                      <div>
                        <p className="text-sm text-white">{m.label}</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{m.note}</p>
                      </div>
                      <span className="text-xs font-mono text-[#60A5FA] shrink-0">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {active === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/8 p-6 space-y-4" style={{ background: "var(--swop-card)" }}>
              <h2 className="text-sm font-semibold text-white">Notification Preferences</h2>
              {[
                { label: "Attrition alert — new HIGH/CRITICAL cohort", enabled: true },
                { label: "Plan review completed", enabled: true },
                { label: "Market intelligence report ready", enabled: false },
                { label: "Budget threshold exceeded (>95%)", enabled: true },
                { label: "New document signals ingested", enabled: false },
                { label: "Weekly workforce digest", enabled: true },
                { label: "Agent error / timeout", enabled: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-white/6 last:border-0">
                  <p className="text-sm text-[#94A3B8]">{n.label}</p>
                  <button className={cn("w-9 h-5 rounded-full transition-colors relative",
                    n.enabled ? "bg-[#2563EB]" : "bg-white/10")}>
                    <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow",
                      n.enabled ? "left-[18px]" : "left-0.5")} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {active === "data" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
                <h2 className="text-sm font-semibold text-white mb-4">Data Sources</h2>
                {[
                  { name: "PostgreSQL Database", status: "connected", detail: "Primary data store — 2,400 employees" },
                  { name: "Anthropic API", status: "connected", detail: "AI inference — claude-opus-4-5" },
                  { name: "Salesforce HRIS", status: "disconnected", detail: "Connect to sync headcount in real-time" },
                  { name: "Workday", status: "disconnected", detail: "Connect for benefits and comp data" },
                ].map((ds) => (
                  <div key={ds.name} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
                    <div>
                      <p className="text-sm text-white">{ds.name}</p>
                      <p className="text-xs text-[#94A3B8]">{ds.detail}</p>
                    </div>
                    <span className={cn("text-xs px-2.5 py-1 rounded-full border",
                      ds.status === "connected" ? "border-[#10B981]/25 text-[#34D399] bg-[#10B981]/10" : "border-white/15 text-[#94A3B8]"
                    )}>{ds.status}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-[#EF4444]/20 p-5" style={{ background: "var(--swop-card)" }}>
                <h2 className="text-sm font-semibold text-white mb-2">Danger Zone</h2>
                <p className="text-xs text-[#94A3B8] mb-3">These actions are irreversible. Proceed with caution.</p>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#EF4444]/30 text-[#F87171] text-sm hover:bg-[#EF4444]/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Clear All Agent Run History
                </button>
              </div>
            </motion.div>
          )}

          {(active === "appearance" || active === "security") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
              <h2 className="text-sm font-semibold text-white mb-4">{active === "appearance" ? "Appearance" : "Security"}</h2>
              <p className="text-sm text-[#94A3B8]">
                {active === "appearance"
                  ? "SWOP uses a dark-optimized design system tuned for extended workforce planning sessions. Additional themes coming in v4."
                  : "SSO, MFA, and audit logs are managed at the organization level. Contact your administrator to configure."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
