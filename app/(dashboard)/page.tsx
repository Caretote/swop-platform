"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, TrendingDown, DollarSign, Bot, Activity, BarChart3, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { HeadcountTrend } from "@/components/dashboard/HeadcountTrend";
import { RiskRadar } from "@/components/dashboard/RiskRadar";
import { AIInsightFeed } from "@/components/dashboard/AIInsightFeed";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const HIRING_FUNNEL = [
  { stage: "Planned", count: 186, color: "#2563EB" },
  { stage: "Approved", count: 162, color: "#0EA5E9" },
  { stage: "Posted", count: 134, color: "#8B5CF6" },
  { stage: "Offer Out", count: 48, color: "#F59E0B" },
  { stage: "Hired", count: 31, color: "#10B981" },
];

const ACTIVE_PLANS = [
  { name: "FY2026 Annual Plan", status: "ACTIVE", progress: 38, color: "#10B981", quarter: "Q2 2026" },
  { name: "AI Transformation", status: "IN_REVIEW", progress: 62, color: "#8B5CF6", quarter: "FY2026" },
  { name: "Q2 Headcount Plan", status: "APPROVED", progress: 51, color: "#2563EB", quarter: "Q2 2026" },
  { name: "3-Year Strategic", status: "DRAFT", progress: 12, color: "#94A3B8", quarter: "FY2026-28" },
];

const AT_RISK_ROLES = [
  { role: "SDR (Sales L2-L3)", bu: "Sales", attritionScore: 68, daysOpen: 42, replacementCost: "$42K" },
  { role: "ML Engineer (L5)", bu: "Engineering", attritionScore: 62, daysOpen: 91, replacementCost: "$185K" },
  { role: "Technical Support Engineer", bu: "CS", attritionScore: 58, daysOpen: 28, replacementCost: "$65K" },
  { role: "Content Strategist", bu: "Marketing", attritionScore: 55, daysOpen: 35, replacementCost: "$58K" },
  { role: "Revenue Operations Analyst", bu: "Sales", attritionScore: 52, daysOpen: 18, replacementCost: "$78K" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  ACTIVE: { label: "Active", color: "text-[#34D399]", dot: "bg-[#10B981]" },
  IN_REVIEW: { label: "In Review", color: "text-[#FCD34D]", dot: "bg-[#F59E0B]" },
  APPROVED: { label: "Approved", color: "text-[#60A5FA]", dot: "bg-[#2563EB]" },
  DRAFT: { label: "Draft", color: "text-[#94A3B8]", dot: "bg-[#94A3B8]" },
};

function PlanCard({ plan, index }: { plan: typeof ACTIVE_PLANS[0]; index: number }) {
  const cfg = STATUS_CONFIG[plan.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.05 }}
      className="rounded-xl border border-white/6 p-4 hover:border-white/10 transition-colors"
      style={{ background: "var(--swop-card)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">{plan.name}</p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">{plan.quarter}</p>
        </div>
        <div className={`flex items-center gap-1.5 text-[11px] ${cfg.color}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#94A3B8]">Progress</span>
          <span className="text-white font-mono">{plan.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${plan.progress}%` }}
            transition={{ delay: 0.6 + index * 0.05, duration: 0.8 }}
            className="h-full rounded-full"
            style={{ background: plan.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          Executive Command Center
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Acme Corp · FY2026 · Real-time workforce intelligence
        </p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard title="Total Headcount" value={2400} change={3.4} changeLabel="vs. plan" icon={<Users className="w-4 h-4" />} accentColor="blue" sparkline={[2158, 2221, 2282, 2338, 2400]} index={0} />
        <KPICard title="Open Requisitions" value={83} change={12} changeLabel="this month" icon={<Briefcase className="w-4 h-4" />} accentColor="amber" sparkline={[45, 58, 72, 68, 83]} index={1} />
        <KPICard title="Attrition Rate" value={8.4} suffix="%" change={-1.2} changeLabel="vs. prior yr" icon={<TrendingDown className="w-4 h-4" />} accentColor="teal" decimals={1} sparkline={[9.6, 9.1, 8.8, 8.6, 8.4]} index={2} />
        <KPICard title="Budget Utilization" value={91} suffix="%" icon={<DollarSign className="w-4 h-4" />} accentColor="green" sparkline={[82, 85, 88, 90, 91]} index={3} />
        <KPICard title="AI Agent FTEs" value={12.7} decimals={1} change={28} changeLabel="vs. prior qtr" icon={<Bot className="w-4 h-4" />} accentColor="purple" sparkline={[4.2, 6.8, 9.1, 11.2, 12.7]} index={4} />
        <KPICard title="Plan Health Score" value={74} suffix="/100" icon={<Activity className="w-4 h-4" />} accentColor="teal" sparkline={[68, 70, 71, 73, 74]} index={5} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HeadcountTrend />
        </div>
        <div>
          <RiskRadar />
        </div>
      </div>

      {/* Hiring funnel + AI insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hiring funnel */}
        <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
          <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-syne, Syne)" }}>Hiring Funnel</h3>
          <p className="text-xs text-[#94A3B8] mb-4">Q2 2026 · All BUs</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={HIRING_FUNNEL} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip
                contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                labelStyle={{ color: "#F1F5F9", fontSize: 12 }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {HIRING_FUNNEL.map((entry) => (
                  <Cell key={entry.stage} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Offer acceptance rate</span>
            <span className="text-white font-mono font-semibold">64.6%</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-[#94A3B8]">Avg time-to-fill</span>
            <span className="text-[#FCD34D] font-mono font-semibold">67 days</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-2">
          <AIInsightFeed />
        </div>
      </div>

      {/* Active plans + At-risk roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active plans */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Active Workforce Plans</h3>
            <a href="/workforce-plans" className="text-xs text-[#2563EB] hover:underline">View all</a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACTIVE_PLANS.map((plan, i) => (
              <PlanCard key={plan.name} plan={plan} index={i} />
            ))}
          </div>
        </div>

        {/* At-risk roles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Top At-Risk Roles</h3>
            <a href="/ai-agents/attrition" className="text-xs text-[#2563EB] hover:underline">Full analysis</a>
          </div>
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left px-4 py-2.5 text-[11px] text-[#94A3B8] font-medium">Role</th>
                  <th className="text-right px-4 py-2.5 text-[11px] text-[#94A3B8] font-medium">Risk</th>
                  <th className="text-right px-4 py-2.5 text-[11px] text-[#94A3B8] font-medium">Days Open</th>
                  <th className="text-right px-4 py-2.5 text-[11px] text-[#94A3B8] font-medium">Replacement</th>
                </tr>
              </thead>
              <tbody>
                {AT_RISK_ROLES.map((role, i) => (
                  <motion.tr
                    key={role.role}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <div className="text-xs font-medium text-white">{role.role}</div>
                      <div className="text-[10px] text-[#94A3B8]">{role.bu}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`text-xs font-mono font-semibold ${role.attritionScore > 65 ? "text-[#F87171]" : role.attritionScore > 55 ? "text-[#FCD34D]" : "text-[#94A3B8]"}`}>
                        {role.attritionScore}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono text-[#94A3B8]">{role.daysOpen}d</td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono text-[#94A3B8]">{role.replacementCost}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
