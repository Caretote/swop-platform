"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FileText, CheckCircle, Clock, Edit3, Archive, MoreVertical } from "lucide-react";

const PLANS = [
  { id: "plan_fy26_annual", name: "FY2026 Annual Workforce Plan", type: "ANNUAL", fiscalYear: "FY2026", status: "ACTIVE", owner: "Jordan Lee", updatedAt: "2h ago", healthScore: 74, scenarios: 3 },
  { id: "plan_fy26_q2", name: "Q2 2026 Headcount Plan", type: "QUARTERLY", fiscalYear: "FY2026", status: "APPROVED", owner: "Alex Chen", updatedAt: "1d ago", healthScore: 81, scenarios: 3 },
  { id: "plan_fy26_ai", name: "AI Transformation Initiative FY2026", type: "AI_TRANSFORMATION", fiscalYear: "FY2026", status: "IN_REVIEW", owner: "Sam Rivera", updatedAt: "3d ago", healthScore: 62, scenarios: 2 },
  { id: "plan_fy28_3yr", name: "3-Year Strategic Plan 2026-2028", type: "THREE_YEAR_STRATEGIC", fiscalYear: "FY2026", status: "DRAFT", owner: "Jordan Lee", updatedAt: "1w ago", healthScore: 41, scenarios: 1 },
];

const TYPE_LABELS: Record<string, string> = {
  ANNUAL: "Annual", QUARTERLY: "Quarterly",
  AI_TRANSFORMATION: "AI Transformation", THREE_YEAR_STRATEGIC: "3-Year Strategic",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; bg: string }> = {
  ACTIVE: { label: "Active", color: "text-[#34D399]", dot: "bg-[#10B981]", bg: "bg-[#10B981]/10 border-[#10B981]/20" },
  IN_REVIEW: { label: "In Review", color: "text-[#FCD34D]", dot: "bg-[#F59E0B]", bg: "bg-[#F59E0B]/10 border-[#F59E0B]/20" },
  APPROVED: { label: "Approved", color: "text-[#60A5FA]", dot: "bg-[#2563EB]", bg: "bg-[#2563EB]/10 border-[#2563EB]/20" },
  DRAFT: { label: "Draft", color: "text-[#94A3B8]", dot: "bg-[#94A3B8]", bg: "bg-white/5 border-white/10" },
};

export default function WorkforcePlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Workforce Plans</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage and track all organizational workforce plans</p>
        </div>
        <Link href="/workforce-plans/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Total Plans", value: 8, color: "#2563EB" },
          { label: "Active", value: 3, color: "#10B981" },
          { label: "In Review", value: 2, color: "#F59E0B" },
          { label: "Avg Health Score", value: "65/100", color: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/8 p-4"
            style={{ background: "var(--swop-card)" }}
          >
            <p className="text-xs text-[#94A3B8]">{stat.label}</p>
            <p className="text-2xl font-bold mt-1 font-mono" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        {PLANS.map((plan, i) => {
          const cfg = STATUS_CONFIG[plan.status];
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="rounded-xl border border-white/8 p-5 hover:border-white/12 transition-all group"
              style={{ background: "var(--swop-card)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 shrink-0">
                    <FileText className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/workforce-plans/${plan.id}`} className="text-sm font-semibold text-white hover:text-[#60A5FA] transition-colors">
                        {plan.name}
                      </Link>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-[#94A3B8]">{TYPE_LABELS[plan.type]} · {plan.fiscalYear}</span>
                      <span className="text-[11px] text-[#94A3B8]">Owner: {plan.owner}</span>
                      <span className="text-[11px] text-[#94A3B8]">{plan.scenarios} scenarios</span>
                      <span className="text-[11px] text-[#94A3B8]">Updated {plan.updatedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-[#94A3B8]">Health</div>
                    <div className={`text-lg font-bold font-mono ${plan.healthScore >= 75 ? "text-[#34D399]" : plan.healthScore >= 60 ? "text-[#FCD34D]" : "text-[#F87171]"}`}>
                      {plan.healthScore}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/workforce-plans/${plan.id}`}>
                      <button className="p-1.5 rounded-lg hover:bg-white/8 text-[#94A3B8] hover:text-white transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
