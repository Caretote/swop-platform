"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Shield, LineChart, FileText, Users, Zap, Clock,
  CheckCircle, AlertTriangle, TrendingUp, DollarSign, BarChart3,
  Activity, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const AGENTS = [
  {
    id: "attrition",
    name: "Attrition Predictor",
    description: "AI-scored flight risk across all workforce cohorts",
    icon: Shield,
    color: "#EF4444",
    status: "active",
    lastRun: "6h ago",
    runsToday: 4,
    tokensToday: 12400,
    avgLatency: "4.2s",
    href: "/ai-agents/attrition",
  },
  {
    id: "market",
    name: "Market Intelligence",
    description: "Real-time talent supply, salary benchmarks, competitor signals",
    icon: LineChart,
    color: "#60A5FA",
    status: "active",
    lastRun: "2h ago",
    runsToday: 11,
    tokensToday: 34200,
    avgLatency: "8.1s",
    href: "/ai-agents/market",
  },
  {
    id: "ingestion",
    name: "Document Ingestion",
    description: "Extracts workforce signals from strategy docs and board memos",
    icon: FileText,
    color: "#10B981",
    status: "active",
    lastRun: "1d ago",
    runsToday: 3,
    tokensToday: 8700,
    avgLatency: "6.4s",
    href: "/ai-agents/ingestion",
  },
  {
    id: "plan-review",
    name: "Multi-Agent Plan Review",
    description: "3 parallel sub-agents: Risk Auditor, Budget Validator, Benchmark Comparator",
    icon: BarChart3,
    color: "#8B5CF6",
    status: "active",
    lastRun: "3h ago",
    runsToday: 2,
    tokensToday: 28900,
    avgLatency: "14.3s",
    href: "/ai-agents/plan-review",
  },
  {
    id: "collaboration",
    name: "Collaboration Advisor",
    description: "7-stage pipeline to redesign every function for the human+agent era",
    icon: Users,
    color: "#A78BFA",
    status: "active",
    lastRun: "2d ago",
    runsToday: 1,
    tokensToday: 52100,
    avgLatency: "92.0s",
    href: "/ai-agents/collaboration",
  },
  {
    id: "copilot",
    name: "SWOP Copilot",
    description: "Streaming conversational workforce planning assistant",
    icon: Brain,
    color: "#F59E0B",
    status: "active",
    lastRun: "12m ago",
    runsToday: 47,
    tokensToday: 91300,
    avgLatency: "1.2s",
    href: "#",
  },
];

const ACTIVITY = [
  { time: "11:42", agent: "Market Intelligence", action: "ML Engineer · SF report completed", type: "success" },
  { time: "11:31", agent: "SWOP Copilot", action: "Scenario comparison: FY26 vs FY26 Alt", type: "success" },
  { time: "10:58", agent: "Multi-Agent Plan Review", action: "Q2 2026 Plan reviewed · Score: 72/100", type: "success" },
  { time: "09:15", agent: "Attrition Predictor", action: "10 cohorts re-scored · 2 tier changes", type: "warning" },
  { time: "08:44", agent: "Document Ingestion", action: "Board Memo ingested · 14 signals", type: "success" },
  { time: "Yesterday", agent: "Collaboration Advisor", action: "Sales Ops blueprint generated", type: "success" },
];

const USAGE_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `D-${13 - i}`,
  tokens: Math.floor(80000 + Math.random() * 60000),
  runs: Math.floor(20 + Math.random() * 50),
}));

const TOTALS = {
  totalRuns: 68,
  totalTokens: "228K",
  estimatedCost: "$4.12",
  uptime: "99.9%",
};

export default function AgentsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          AI Agent Control Center
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Monitor all 6 SWOP intelligence agents — usage, latency, and activity
        </p>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Agent Runs Today", value: TOTALS.totalRuns.toString(), icon: Activity, color: "#60A5FA" },
          { label: "Tokens Consumed", value: TOTALS.totalTokens, icon: Zap, color: "#8B5CF6" },
          { label: "Est. Cost Today", value: TOTALS.estimatedCost, icon: DollarSign, color: "#F59E0B" },
          { label: "Agent Uptime", value: TOTALS.uptime, icon: CheckCircle, color: "#10B981" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-xs text-[#94A3B8]">{s.label}</span>
            </div>
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Agent cards */}
        <div className="lg:col-span-2 space-y-3">
          {AGENTS.map((agent, i) => (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={agent.href}>
                <div className="rounded-xl border border-white/8 p-4 hover:border-white/16 transition-all cursor-pointer group"
                  style={{ background: "var(--swop-card)" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}30` }}>
                      <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white">{agent.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#34D399]">
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate">{agent.description}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-5 shrink-0 text-right">
                      <div>
                        <p className="text-[10px] text-[#94A3B8]">Today</p>
                        <p className="text-sm font-mono font-medium text-white">{agent.runsToday} runs</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#94A3B8]">Tokens</p>
                        <p className="text-sm font-mono font-medium text-white">{(agent.tokensToday / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#94A3B8]">Avg latency</p>
                        <p className="text-sm font-mono font-medium" style={{ color: agent.color }}>{agent.avgLatency}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Activity feed + usage chart */}
        <div className="space-y-4">
          {/* Usage chart */}
          <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-white">Token Usage (14d)</p>
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-1 text-[#94A3B8] outline-none">
                <option value="7d" className="bg-[#1A2235]">7d</option>
                <option value="14d" className="bg-[#1A2235]">14d</option>
                <option value="30d" className="bg-[#1A2235]">30d</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={USAGE_DATA}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="tokens" stroke="#8B5CF6" fill="url(#tokenGrad)" strokeWidth={1.5} dot={false} />
                <Tooltip contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#A78BFA" }} formatter={(v: any) => [`${(v/1000).toFixed(0)}K tokens`, ""]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity */}
          <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs font-semibold text-white mb-3">Recent Activity</p>
            <div className="space-y-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    a.type === "success" ? "bg-[#10B981]" : "bg-[#F59E0B]")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#94A3B8]/60">{a.time} · {a.agent}</p>
                    <p className="text-xs text-[#94A3B8] leading-tight">{a.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
