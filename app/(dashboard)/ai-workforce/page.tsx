"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Bot, Users, Zap, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

const TIMELINE_DATA = [
  { period: "Q1'26", humans: 2400, agents: 12.7 },
  { period: "Q2'26", humans: 2420, agents: 18.5 },
  { period: "Q3'26", humans: 2435, agents: 26.2 },
  { period: "Q4'26", humans: 2445, agents: 35.1 },
  { period: "Q1'27", humans: 2455, agents: 48.0 },
  { period: "Q2'27", humans: 2460, agents: 62.4 },
];

const BY_FUNCTION = [
  { fn: "Sales", humans: 580, agents: 4.2, rate: 23, target: 35, tasks: ["Lead qualification", "CRM hygiene", "Meeting scheduling"] },
  { fn: "Customer Success", humans: 370, agents: 8.5, rate: 31, target: 45, tasks: ["Tier-1 support", "FAQ resolution", "Ticket routing"] },
  { fn: "Finance", humans: 180, agents: 1.8, rate: 12, target: 28, tasks: ["Invoice processing", "Reconciliation", "Report generation"] },
  { fn: "Operations", humans: 340, agents: 2.2, rate: 8, target: 22, tasks: ["Data entry", "Scheduling", "Status reporting"] },
  { fn: "Marketing", humans: 210, agents: 1.4, rate: 9, target: 20, tasks: ["Content drafting", "Campaign reporting", "Social scheduling"] },
  { fn: "Engineering", humans: 720, agents: 3.6, rate: 6, target: 15, tasks: ["Code review assist", "Test generation", "Docs writing"] },
];

const PHASES = [
  { phase: "Phase 1", label: "Augment", subtitle: "AI assists humans", period: "Now → Q2'26", color: "#2563EB", complete: true, items: ["Agentforce Sales Coach live", "SDR email assist", "CS tier-1 auto-routing"] },
  { phase: "Phase 2", label: "Delegate", subtitle: "AI executes defined tasks", period: "Q3'26 → Q4'26", color: "#8B5CF6", complete: false, items: ["Full SDR pipeline automation", "Finance auto-reconciliation", "CS ticket resolution"] },
  { phase: "Phase 3", label: "Orchestrate", subtitle: "AI manages workflows", period: "Q1'27 → Q2'27", color: "#0EA5E9", complete: false, items: ["Multi-agent sales workflows", "AI-led onboarding journeys", "Autonomous QBR prep"] },
  { phase: "Phase 4", label: "Transform", subtitle: "New human roles created", period: "Q3'27+", color: "#10B981", complete: false, items: ["AI Orchestration Managers", "Human-AI Experience Designers", "Judgment & Ethics Officers"] },
];

export default function AIWorkforcePage() {
  const [selectedFn, setSelectedFn] = useState("Sales");
  const fn = BY_FUNCTION.find((f) => f.fn === selectedFn)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          AI & Digital Labor Center
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">Human + Agent workforce composition, roadmap, and transformation progress</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "AI Agent FTEs", value: 21.7, decimals: 1, suffix: " FTE", color: "#A78BFA", change: "+71% QoQ" },
          { label: "Human:Agent Ratio", value: 110, suffix: ":1", color: "#60A5FA", change: "→ 40:1 by 2027" },
          { label: "Automation Rate", value: 14, suffix: "%", color: "#34D399", change: "Target: 28%" },
          { label: "Productivity Multiplier", value: 1.31, decimals: 2, suffix: "×", color: "#FCD34D", change: "vs. pre-AI baseline" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8]">{k.label}</p>
            <p className="text-2xl font-bold font-mono mt-1" style={{ color: k.color }}>
              <AnimatedNumber value={k.value} decimals={k.decimals ?? 0} suffix={k.suffix} />
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-1">{k.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Trend chart + by-function grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-syne, Syne)" }}>Human vs. Agent FTE Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TIMELINE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="period" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} labelStyle={{ color: "#F1F5F9", fontSize: 12 }} />
              <Area type="monotone" dataKey="humans" stroke="#2563EB" strokeWidth={2} fill="url(#hGrad)" name="Humans" />
              <Area type="monotone" dataKey="agents" stroke="#8B5CF6" strokeWidth={2} fill="url(#aGrad)" name="Agent FTEs" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-syne, Syne)" }}>Automation Rate by Function</h3>
          <div className="space-y-3">
            {BY_FUNCTION.map((f) => (
              <div key={f.fn} className="flex items-center gap-3">
                <span className="text-xs text-[#94A3B8] w-28 shrink-0">{f.fn}</span>
                <div className="flex-1 h-3 rounded-full bg-white/8 overflow-hidden relative">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${f.target}%` }} transition={{ duration: 0.8 }}
                    className="absolute inset-0 rounded-full opacity-20 bg-[#8B5CF6]" />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${f.rate}%` }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-[#8B5CF6]" />
                </div>
                <span className="text-xs font-mono text-[#A78BFA] w-10 text-right">{f.rate}%</span>
                <span className="text-[10px] text-[#94A3B8]">→{f.target}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Redesign Workshop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-syne, Syne)" }}>Role Redesign Workshop</h3>
          <div className="space-y-1">
            {BY_FUNCTION.map((f) => (
              <button key={f.fn} onClick={() => setSelectedFn(f.fn)}
                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                  selectedFn === f.fn ? "bg-[#2563EB]/15 text-white border border-[#2563EB]/30" : "text-[#94A3B8] hover:bg-white/4")}>
                {f.fn}
                <span className="float-right text-[11px] font-mono">{f.agents} agent FTEs</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>{fn.fn} — AI Redesign</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25">
              {fn.agents} FTE equiv from agents
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#94A3B8] mb-2 font-semibold uppercase tracking-wider">AI Can Handle</p>
              <div className="space-y-1.5">
                {fn.tasks.map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                    <Bot className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] mb-2 font-semibold uppercase tracking-wider">Remains Human</p>
              <div className="space-y-1.5">
                {["Strategic relationships", "Complex judgment calls", "Cross-functional leadership", "Creative problem solving"].slice(0, 3).map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                    <Users className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg border border-[#10B981]/20 bg-[#10B981]/5">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-[#34D399]" />
              <span className="text-white font-medium">FTE Savings: <span className="text-[#34D399] font-mono">{(fn.agents * 0.4).toFixed(1)}</span></span>
              <span className="text-[#94A3B8]">— Recommendation: Augment, don't eliminate</span>
            </div>
          </div>
          <a href="/ai-agents/collaboration" className="mt-3 flex items-center gap-1.5 text-xs text-[#60A5FA] hover:underline">
            <Zap className="w-3 h-3" /> Run full Collaboration Advisor analysis <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Transformation roadmap */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-syne, Syne)" }}>Transformation Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {PHASES.map((p, i) => (
            <motion.div key={p.phase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={cn("rounded-xl border p-4", p.complete ? "border-[#10B981]/30 bg-[#10B981]/5" : "border-white/8")}
              style={{ background: p.complete ? undefined : "var(--swop-card)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{p.phase}</span>
                {p.complete && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
              </div>
              <div className="font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-syne, Syne)" }}>{p.label}</div>
              <div className="text-xs text-[#94A3B8] mb-3">{p.subtitle}</div>
              <div className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: p.color + "15", color: p.color }}>{p.period}</div>
              <ul className="mt-3 space-y-1">
                {p.items.map((item) => (
                  <li key={item} className="text-[11px] text-[#94A3B8] flex items-start gap-1.5">
                    <span style={{ color: p.color }}>·</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
