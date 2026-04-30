"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, DollarSign, Brain, Shield,
  Download, RefreshCw, Calendar, ChevronRight, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/lib/utils";

const HEADCOUNT_TREND = [
  { month: "May", total: 2280, engineering: 695, sales: 558, cs: 355 },
  { month: "Jun", total: 2305, engineering: 702, sales: 562, cs: 361 },
  { month: "Jul", total: 2318, engineering: 708, sales: 565, cs: 364 },
  { month: "Aug", total: 2330, engineering: 710, sales: 568, cs: 368 },
  { month: "Sep", total: 2344, engineering: 714, sales: 571, cs: 370 },
  { month: "Oct", total: 2356, engineering: 716, sales: 574, cs: 372 },
  { month: "Nov", total: 2362, engineering: 718, sales: 576, cs: 368 },
  { month: "Dec", total: 2368, engineering: 719, sales: 577, cs: 370 },
  { month: "Jan", total: 2379, engineering: 720, sales: 578, cs: 371 },
  { month: "Feb", total: 2388, engineering: 721, sales: 580, cs: 372 },
  { month: "Mar", total: 2395, engineering: 720, sales: 580, cs: 370 },
  { month: "Apr", total: 2400, engineering: 720, sales: 580, cs: 370 },
];

const BUDGET_DATA = [
  { bu: "Engineering", budget: 94200, actual: 89400 },
  { bu: "Sales", bu_short: "Sales", budget: 72800, actual: 68300 },
  { bu: "CS", budget: 42100, actual: 41200 },
  { bu: "Marketing", budget: 28400, actual: 25100 },
  { bu: "Operations", budget: 31600, actual: 29800 },
  { bu: "Finance", budget: 18900, actual: 17400 },
];

const ATTRITION_TREND = [
  { month: "May", rate: 9.2 }, { month: "Jun", rate: 8.8 }, { month: "Jul", rate: 8.5 },
  { month: "Aug", rate: 8.1 }, { month: "Sep", rate: 7.9 }, { month: "Oct", rate: 8.2 },
  { month: "Nov", rate: 8.6 }, { month: "Dec", rate: 8.1 }, { month: "Jan", rate: 7.8 },
  { month: "Feb", rate: 8.0 }, { month: "Mar", rate: 8.3 }, { month: "Apr", rate: 8.4 },
];

const HIRING_FUNNEL = [
  { stage: "Applied", count: 4820, fill: "#2563EB" },
  { stage: "Screened", count: 1244, fill: "#3B82F6" },
  { stage: "Interview", count: 387, fill: "#60A5FA" },
  { stage: "Offer", count: 112, fill: "#93C5FD" },
  { stage: "Hired", count: 83, fill: "#BFDBFE" },
];

const SKILLS_GAP = [
  { skill: "Agentforce / AI Agent Orchestration", gap: 92 },
  { skill: "LLM Integration & Prompt Engineering", gap: 79 },
  { skill: "MLOps & Model Deployment", gap: 78 },
  { skill: "Change Management", gap: 66 },
  { skill: "Data Engineering (dbt, Spark)", gap: 58 },
  { skill: "Product-led Growth", gap: 51 },
];

const REPORT_CARDS = [
  {
    id: "headcount",
    title: "Headcount Trend",
    subtitle: "12-month rolling",
    icon: Users,
    color: "#60A5FA",
    delta: "+120",
    deltaDir: "up",
    chart: "area",
  },
  {
    id: "budget",
    title: "Budget vs. Actuals",
    subtitle: "By business unit",
    icon: DollarSign,
    color: "#10B981",
    delta: "-4.2%",
    deltaDir: "down",
    chart: "bar",
  },
  {
    id: "attrition",
    title: "Attrition Rate Trend",
    subtitle: "12-month rolling",
    icon: TrendingUp,
    color: "#F59E0B",
    delta: "8.4%",
    deltaDir: "neutral",
    chart: "line",
  },
  {
    id: "hiring",
    title: "Hiring Funnel",
    subtitle: "Current pipeline",
    icon: BarChart3,
    color: "#2563EB",
    delta: "6.7% conv.",
    deltaDir: "neutral",
    chart: "funnel",
  },
  {
    id: "skills",
    title: "Skills Gap Analysis",
    subtitle: "Top critical gaps",
    icon: Brain,
    color: "#8B5CF6",
    delta: "6 gaps",
    deltaDir: "neutral",
    chart: "skills",
  },
  {
    id: "risk",
    title: "AI Risk Assessment",
    subtitle: "Role automation risk",
    icon: Shield,
    color: "#EF4444",
    delta: "41% moderate+",
    deltaDir: "neutral",
    chart: "pie",
  },
];

const AI_RISK_PIE = [
  { name: "Low", value: 59, fill: "#10B981" },
  { name: "Moderate", value: 28, fill: "#F59E0B" },
  { name: "High", value: 10, fill: "#F97316" },
  { name: "Critical", value: 3, fill: "#EF4444" },
];

function MiniChart({ type, color }: { type: string; color: string }) {
  if (type === "area") return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={HEADCOUNT_TREND.slice(-6)}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="total" stroke={color} fill={`url(#grad-${color})`} strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
  if (type === "line") return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={ATTRITION_TREND.slice(-6)}>
        <Line type="monotone" dataKey="rate" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
  if (type === "bar") return (
    <ResponsiveContainer width="100%" height={60}>
      <BarChart data={BUDGET_DATA.slice(0, 4)}>
        <Bar dataKey="actual" fill={color} radius={2} />
      </BarChart>
    </ResponsiveContainer>
  );
  if (type === "pie") return (
    <ResponsiveContainer width="100%" height={60}>
      <PieChart>
        <Pie data={AI_RISK_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={15} outerRadius={28}>
          {AI_RISK_PIE.map((e) => <Cell key={e.name} fill={e.fill} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
  return null;
}

export default function AnalyticsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
            Analytics Hub
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Pre-built workforce intelligence reports · Updated daily
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">
            <Calendar className="w-4 h-4" />
            Apr 2026
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORT_CARDS.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div
              onClick={() => setActiveReport(activeReport === r.id ? null : r.id)}
              className={cn(
                "rounded-xl border p-5 cursor-pointer transition-all",
                activeReport === r.id ? "border-white/20" : "border-white/8 hover:border-white/14"
              )}
              style={{ background: "var(--swop-card)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <r.icon className="w-4 h-4" style={{ color: r.color }} />
                  <div>
                    <p className="text-sm font-semibold text-white">{r.title}</p>
                    <p className="text-xs text-[#94A3B8]">{r.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono font-medium" style={{ color: r.color }}>{r.delta}</span>
                  {r.deltaDir === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />}
                  {r.deltaDir === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-[#10B981]" />}
                </div>
              </div>
              {(r.chart === "area" || r.chart === "line" || r.chart === "bar" || r.chart === "pie") && (
                <MiniChart type={r.chart} color={r.color} />
              )}
              {r.chart === "funnel" && (
                <div className="space-y-1.5">
                  {HIRING_FUNNEL.map((f) => (
                    <div key={f.stage} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#94A3B8] w-16 shrink-0">{f.stage}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${(f.count / 4820) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#94A3B8] w-10 text-right shrink-0">{f.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              {r.chart === "skills" && (
                <div className="space-y-1.5">
                  {SKILLS_GAP.slice(0, 4).map((s) => (
                    <div key={s.skill} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#94A3B8] truncate">{s.skill.split(" ").slice(0, 3).join(" ")}</p>
                      </div>
                      <div className="w-20 h-1.5 rounded-full bg-white/5 shrink-0">
                        <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: `${s.gap}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#A78BFA] shrink-0">{s.gap}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded detail: Headcount Trend */}
      {activeReport === "headcount" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Headcount Trend — 12 Month</h3>
            <button className="text-xs text-[#60A5FA] hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={HEADCOUNT_TREND}>
              <defs>
                <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#60A5FA" }} />
              <Area type="monotone" dataKey="total" stroke="#60A5FA" fill="url(#hcGrad)" strokeWidth={2} dot={false} name="Total HC" />
              <Area type="monotone" dataKey="engineering" stroke="#8B5CF6" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Engineering" />
              <Area type="monotone" dataKey="sales" stroke="#10B981" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Sales" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Expanded: Budget vs Actuals */}
      {activeReport === "budget" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Budget vs. Actuals by BU (YTD, $K)</h3>
            <button className="text-xs text-[#60A5FA] hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BUDGET_DATA} barCategoryGap="30%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="bu" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94A3B8" }} formatter={(v: any) => [`$${(v/1000).toFixed(0)}K`, ""]} />
              <Bar dataKey="budget" fill="rgba(96,165,250,0.2)" radius={[4,4,0,0]} name="Budget" />
              <Bar dataKey="actual" fill="#10B981" radius={[4,4,0,0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Expanded: Skills Gap */}
      {activeReport === "skills" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/8 p-6" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Skills Gap — Top Critical Gaps</h3>
          <div className="space-y-3">
            {SKILLS_GAP.map((s) => (
              <div key={s.skill} className="flex items-center gap-4">
                <p className="text-sm text-[#94A3B8] flex-1">{s.skill}</p>
                <div className="w-48 h-2 rounded-full bg-white/8 shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${s.gap}%`, background: s.gap > 80 ? "#EF4444" : s.gap > 60 ? "#F59E0B" : "#8B5CF6" }} />
                </div>
                <span className="text-sm font-mono font-bold shrink-0" style={{ color: s.gap > 80 ? "#F87171" : s.gap > 60 ? "#FCD34D" : "#A78BFA" }}>{s.gap}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
