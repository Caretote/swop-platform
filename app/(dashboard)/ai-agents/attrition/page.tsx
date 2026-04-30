"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, RefreshCw, AlertTriangle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_CONFIG = {
  CRITICAL: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "Critical" },
  HIGH: { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", label: "High" },
  ELEVATED: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Elevated" },
  MODERATE: { color: "#0EA5E9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.25)", label: "Moderate" },
  LOW: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "Low" },
};

const MOCK_DATA = [
  { cohortKey: "Sales-SDR-L2", riskScore: 0.68, riskTier: "HIGH", topDrivers: ["Below market comp (-18%)", "No promotion in 18mo", "Manager change Q4"], recommendedActions: ["Immediate compensation review", "Promo velocity audit", "Stay interviews"] },
  { cohortKey: "CS-Support-L3", riskScore: 0.62, riskTier: "HIGH", topDrivers: ["High ticket volume burnout", "Limited AI tooling", "Flat career path"], recommendedActions: ["Agentforce tier-1 automation", "CS career ladder redesign", "EX survey"] },
  { cohortKey: "Engineering-ML-L5", riskScore: 0.40, riskTier: "ELEVATED", topDrivers: ["Competing Anthropic/OpenAI offers", "Below P75 comp", "Equity cliff in 3mo"], recommendedActions: ["Immediate comp review", "Equity acceleration", "Retention conversation"] },
  { cohortKey: "Marketing-Content-L4", riskScore: 0.55, riskTier: "ELEVATED", topDrivers: ["AI disruption anxiety", "Role ambiguity", "Below market -12%"], recommendedActions: ["Role redesign workshop", "Reskilling investment", "Career path clarity"] },
  { cohortKey: "Sales-AE-L5", riskScore: 0.31, riskTier: "MODERATE", topDrivers: ["Q1 quota miss", "Territory concerns"], recommendedActions: ["Quota reassessment", "Territory rebalancing"] },
  { cohortKey: "Engineering-Data-L4", riskScore: 0.22, riskTier: "MODERATE", topDrivers: ["Limited data stack modernization"], recommendedActions: ["Data tooling upgrade roadmap"] },
  { cohortKey: "Finance-FPA-L3", riskScore: 0.32, riskTier: "MODERATE", topDrivers: ["Repetitive manual work", "Limited advancement"], recommendedActions: ["FP&A automation tools", "Promotion planning"] },
  { cohortKey: "Operations-L3", riskScore: 0.18, riskTier: "LOW", topDrivers: ["Manual process frustration"], recommendedActions: ["Process automation pilot"] },
  { cohortKey: "Finance-Controller", riskScore: 0.12, riskTier: "LOW", topDrivers: [], recommendedActions: [] },
  { cohortKey: "Engineering-SWE-L5", riskScore: 0.35, riskTier: "MODERATE", topDrivers: ["Hybrid policy changes", "Slow promo cycles"], recommendedActions: ["Return-to-office policy review"] },
];

export default function AttritionPage() {
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastRun] = useState("6 hours ago");

  const critical = data.filter((d) => d.riskTier === "CRITICAL" || d.riskTier === "HIGH");
  const avgRisk = (data.reduce((a, d) => a + d.riskScore, 0) / data.length * 100).toFixed(1);

  const rerun = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Attrition Predictor</h1>
          <p className="text-sm text-[#94A3B8] mt-1">AI-scored flight risk across all workforce cohorts · Last run: {lastRun}</p>
        </div>
        <button onClick={rerun} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white hover:border-white/20 transition-colors disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          {loading ? "Running..." : "Re-run Analysis"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Cohorts Scored", value: "847", color: "#60A5FA" },
          { label: "High / Critical", value: critical.length.toString(), color: "#F87171" },
          { label: "Avg Risk Score", value: `${avgRisk}%`, color: "#FCD34D" },
          { label: "Est. Flight Risk (12mo)", value: "~203 FTEs", color: "#F97316" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8]">{s.label}</p>
            <p className="text-2xl font-bold font-mono mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {critical.length > 0 && (
        <div className="rounded-xl border border-[#EF4444]/25 p-4 bg-[#EF4444]/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#F87171]" />
            <span className="text-sm font-semibold text-white">{critical.length} High-Risk Cohorts Need Attention</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {critical.map((c) => (
              <span key={c.cohortKey} className="text-xs px-2.5 py-1 rounded-full border" style={{ background: TIER_CONFIG[c.riskTier as keyof typeof TIER_CONFIG].bg, borderColor: TIER_CONFIG[c.riskTier as keyof typeof TIER_CONFIG].border, color: TIER_CONFIG[c.riskTier as keyof typeof TIER_CONFIG].color }}>
                {c.cohortKey} · {Math.round(c.riskScore * 100)}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data.sort((a, b) => b.riskScore - a.riskScore).map((row, i) => {
          const cfg = TIER_CONFIG[row.riskTier as keyof typeof TIER_CONFIG];
          const isOpen = expanded === row.cohortKey;
          return (
            <motion.div key={row.cohortKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-xl border overflow-hidden transition-all" style={{ background: "var(--swop-card)", borderColor: isOpen ? cfg.border : "rgba(255,255,255,0.08)" }}>
              <button onClick={() => setExpanded(isOpen ? null : row.cohortKey)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/2 transition-colors">
                <div className="w-32 shrink-0">
                  <div className="h-1.5 rounded-full bg-white/8">
                    <div className="h-full rounded-full transition-all" style={{ width: `${row.riskScore * 100}%`, background: cfg.color }} />
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {cfg.label}
                </span>
                <span className="text-sm font-semibold text-white flex-1">{row.cohortKey}</span>
                <span className="text-lg font-bold font-mono shrink-0" style={{ color: cfg.color }}>{Math.round(row.riskScore * 100)}%</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />}
              </button>
              {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden border-t border-white/6">
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#94A3B8] font-semibold mb-2 uppercase tracking-wider">Top Drivers</p>
                      <ul className="space-y-1.5">
                        {row.topDrivers.map((d) => (
                          <li key={d} className="text-sm text-[#94A3B8] flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-semibold mb-2 uppercase tracking-wider">Recommended Actions</p>
                      <ul className="space-y-1.5">
                        {row.recommendedActions.map((a) => (
                          <li key={a} className="text-sm text-[#94A3B8] flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-0.5 text-[#10B981] shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button className="px-3 py-1.5 rounded-lg text-xs border border-[#2563EB]/30 text-[#60A5FA] hover:bg-[#2563EB]/10 transition-colors">
                      Add to Action Plan
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
