"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Users, DollarSign, Calendar, Edit3, Check,
  ChevronDown, Plus, Trash2, Download, ArrowLeft, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

const PLAN = {
  id: "plan_fy26_annual",
  name: "FY2026 Annual Workforce Plan",
  status: "Active",
  owner: "Michael Jones",
  targetDate: "Dec 31, 2026",
  currentHeadcount: 2400,
  targetHeadcount: 2640,
  budgetAllocated: 288400000,
  budgetUsed: 261900000,
  healthScore: 74,
};

const SCENARIOS = [
  { id: "s1", name: "Base Case", delta: "+240 HC", probability: "60%", active: true },
  { id: "s2", name: "Aggressive Growth", delta: "+380 HC", probability: "25%", active: false },
  { id: "s3", name: "Conservative", delta: "+120 HC", probability: "15%", active: false },
];

const LINE_ITEMS = [
  { bu: "Engineering", role: "Senior SWE", level: "L5", qty: 28, salary: 185000, start: "Q1 2026", status: "approved" },
  { bu: "Engineering", role: "ML Engineer", level: "L5", qty: 12, salary: 210000, start: "Q1 2026", status: "approved" },
  { bu: "Sales", role: "Enterprise AE", level: "L4", qty: 22, salary: 145000, start: "Q2 2026", status: "approved" },
  { bu: "Sales", role: "SDR", level: "L2", qty: 30, salary: 75000, start: "Q1 2026", status: "approved" },
  { bu: "Customer Success", role: "CSM", level: "L3", qty: 18, salary: 105000, start: "Q2 2026", status: "pending" },
  { bu: "Marketing", role: "Product Marketing Manager", level: "L4", qty: 4, salary: 155000, start: "Q3 2026", status: "pending" },
  { bu: "Engineering", role: "Staff Engineer", level: "L6", qty: 6, salary: 245000, start: "Q3 2026", status: "under_review" },
  { bu: "Operations", role: "RevOps Analyst", level: "L3", qty: 8, salary: 95000, start: "Q4 2026", status: "pending" },
];

const STATUS_CONFIG = {
  approved: { label: "Approved", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  pending: { label: "Pending", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  under_review: { label: "In Review", color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)" },
};

const TREND_DATA = [
  { month: "Apr", hc: 2400 }, { month: "May", hc: 2428 }, { month: "Jun", hc: 2452 },
  { month: "Jul", hc: 2476 }, { month: "Aug", hc: 2499 }, { month: "Sep", hc: 2518 },
  { month: "Oct", hc: 2539 }, { month: "Nov", hc: 2558 }, { month: "Dec", hc: 2640 },
];

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const [activeScenario, setActiveScenario] = useState("s1");
  const [editingName, setEditingName] = useState(false);

  const totalNewHires = LINE_ITEMS.reduce((a, r) => a + r.qty, 0);
  const totalBudgetImpact = LINE_ITEMS.reduce((a, r) => a + r.qty * r.salary, 0);
  const budgetPct = Math.round((PLAN.budgetUsed / PLAN.budgetAllocated) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/workforce-plans" className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All Plans
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
              {PLAN.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#34D399]">{PLAN.status}</span>
          </div>
          <p className="text-sm text-[#94A3B8] mt-0.5">Owner: {PLAN.owner} · Target: {PLAN.targetDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1d4ed8] transition-colors">
            <Check className="w-4 h-4" /> Approve Plan
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Current HC", value: PLAN.currentHeadcount.toLocaleString(), icon: Users, color: "#60A5FA" },
          { label: "Target HC", value: PLAN.targetHeadcount.toLocaleString(), icon: TrendingUp, color: "#10B981" },
          { label: "Budget Utilization", value: `${budgetPct}%`, icon: DollarSign, color: budgetPct > 90 ? "#F59E0B" : "#10B981" },
          { label: "Plan Health", value: `${PLAN.healthScore}/100`, icon: BarChart3, color: "#8B5CF6" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <div className="flex items-center gap-2 mb-1">
              <k.icon className="w-3.5 h-3.5" style={{ color: k.color }} />
              <span className="text-xs text-[#94A3B8]">{k.label}</span>
            </div>
            <p className="text-2xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* HC trajectory chart */}
        <div className="lg:col-span-2 rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Headcount Trajectory</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[2350, 2700]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#60A5FA" }} />
              <Area type="monotone" dataKey="hc" stroke="#2563EB" fill="url(#planGrad)" strokeWidth={2} dot={false} name="HC" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario selector */}
        <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Scenarios</h3>
          <div className="space-y-2 mb-4">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors",
                  activeScenario === s.id
                    ? "border-[#2563EB]/40 bg-[#2563EB]/8"
                    : "border-white/8 hover:border-white/16"
                )}
              >
                <div>
                  <p className={cn("text-sm font-medium", activeScenario === s.id ? "text-white" : "text-[#94A3B8]")}>{s.name}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{s.delta} · {s.probability} probability</p>
                </div>
                {activeScenario === s.id && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
              </button>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-white/12 text-xs text-[#94A3B8] hover:text-white hover:border-white/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Scenario
          </button>
        </div>
      </div>

      {/* Line items table */}
      <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
          <h3 className="text-sm font-semibold text-white">Headcount Line Items</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94A3B8]">{totalNewHires} positions · ${(totalBudgetImpact / 1000000).toFixed(1)}M impact</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB]/15 text-[#60A5FA] text-xs hover:bg-[#2563EB]/25 transition-colors">
              <Plus className="w-3 h-3" /> Add Role
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                {["BU", "Role", "Level", "Qty", "Salary", "Start", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINE_ITEMS.map((row, i) => {
                const sc = STATUS_CONFIG[row.status as keyof typeof STATUS_CONFIG];
                return (
                  <tr key={i} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-xs text-[#94A3B8]">{row.bu}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{row.role}</td>
                    <td className="px-4 py-3 text-xs font-mono text-[#94A3B8]">{row.level}</td>
                    <td className="px-4 py-3 text-sm font-mono text-white">{row.qty}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[#94A3B8]">${(row.salary / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-xs text-[#94A3B8]">{row.start}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                        style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}>
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
