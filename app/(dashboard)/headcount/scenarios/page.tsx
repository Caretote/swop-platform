"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Lock, Sparkles, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    id: "base", name: "Base Case", type: "BASE", locked: true,
    headcountDelta: 60, budgetImpact: 10_800_000, riskScore: 0.22,
    color: "#2563EB", description: "15% revenue growth, 8% attrition, 90-day TTF",
    lineItems: [
      { bu: "Sales", role: "Enterprise AE", action: "HIRE", qty: 18, q: "Q2", cost: 3_240_000 },
      { bu: "Engineering", role: "Senior SWE", action: "HIRE", qty: 22, q: "Q2", cost: 4_620_000 },
      { bu: "Engineering", role: "ML Engineer", action: "HIRE", qty: 8, q: "Q3", cost: 1_840_000 },
      { bu: "Sales", role: "SDR", action: "AUTOMATE", qty: 12, q: "Q2", cost: -780_000 },
    ],
  },
  {
    id: "optimistic", name: "Optimistic", type: "OPTIMISTIC", locked: false,
    headcountDelta: 120, budgetImpact: 21_600_000, riskScore: 0.38,
    color: "#10B981", description: "25% revenue growth, 7% attrition, hiring surge",
    lineItems: [
      { bu: "Sales", role: "Enterprise AE", action: "HIRE", qty: 35, q: "Q1", cost: 6_300_000 },
      { bu: "Engineering", role: "Senior SWE", action: "HIRE", qty: 45, q: "Q2", cost: 9_450_000 },
      { bu: "Marketing", role: "Demand Gen", action: "HIRE", qty: 12, q: "Q2", cost: 1_656_000 },
    ],
  },
  {
    id: "conservative", name: "Conservative", type: "CONSERVATIVE", locked: false,
    headcountDelta: -20, budgetImpact: -3_600_000, riskScore: 0.14,
    color: "#F59E0B", description: "5% revenue growth, hiring freeze in non-critical roles",
    lineItems: [
      { bu: "Operations", role: "Business Analyst", action: "ELIMINATE", qty: 8, q: "Q1", cost: -656_000 },
      { bu: "Marketing", role: "Content Strategist", action: "AUTOMATE", qty: 5, q: "Q1", cost: -500_000 },
    ],
  },
  {
    id: "ai_augmented", name: "AI-Augmented", type: "AI_AUGMENTED", locked: false,
    headcountDelta: 20, budgetImpact: 1_200_000, riskScore: 0.29,
    color: "#8B5CF6", description: "AI agents replace 40% of SDRs + Support tier 1, grow selectively",
    lineItems: [
      { bu: "Sales", role: "AI Sales Agent", action: "CONVERT_AGENT", qty: 24, q: "Q1", cost: -2_880_000 },
      { bu: "CS", role: "AI Service Agent", action: "CONVERT_AGENT", qty: 18, q: "Q2", cost: -1_620_000 },
      { bu: "Engineering", role: "ML Engineer", action: "HIRE", qty: 15, q: "Q2", cost: 3_450_000 },
    ],
  },
];

const COMPARE_METRICS = [
  { metric: "Net HC Change", base: "+60", optimistic: "+120", conservative: "-20", ai: "+20" },
  { metric: "Budget Impact", base: "+$10.8M", optimistic: "+$21.6M", conservative: "-$3.6M", ai: "+$1.2M" },
  { metric: "Risk Score", base: "22/100", optimistic: "38/100", conservative: "14/100", ai: "29/100" },
  { metric: "AI FTE Equiv.", base: "12.7", optimistic: "12.7", conservative: "12.7", ai: "28.4" },
  { metric: "Cost per FTE", base: "$180K", optimistic: "$180K", conservative: "$180K", ai: "$148K" },
];

const ACTION_COLORS: Record<string, string> = {
  HIRE: "#10B981", AUTOMATE: "#8B5CF6", ELIMINATE: "#EF4444", CONVERT_AGENT: "#F59E0B", BACKFILL: "#2563EB",
};

export default function ScenariosPage() {
  const [selected, setSelected] = useState("base");
  const [whatIf, setWhatIf] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const activeScenario = SCENARIOS.find((s) => s.id === selected)!;
  const waterfallData = [
    { name: "Base HC", value: 2400, fill: "#2563EB" },
    ...activeScenario.lineItems.map((li) => ({
      name: `${li.action} ${li.role.split(" ").slice(-1)[0]}`,
      value: li.action === "HIRE" ? li.qty : -li.qty,
      fill: ACTION_COLORS[li.action],
    })),
    { name: "EOY Target", value: 2400 + activeScenario.headcountDelta, fill: "#0EA5E9" },
  ];

  const handleWhatIf = async () => {
    if (!whatIf.trim()) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAiLoading(false);
    alert(`AI Analysis: "${whatIf}"\n\nBased on your input, the AI Augmented scenario would be most appropriate. Recommended adjustments: increase AI offset to 45%, add 8 ML Engineer hires in Q2, reduce SDR headcount by 30. Estimated budget impact: +$2.1M vs base case. Risk score: 31/100.`);
    setWhatIf("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Scenario Modeler</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Model and compare workforce scenarios</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1d4ed8] transition-colors">
          <Plus className="w-4 h-4" /> New Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Scenario list */}
        <div className="space-y-2">
          <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider px-1">Scenarios</p>
          {SCENARIOS.map((s) => (
            <motion.button
              key={s.id}
              onClick={() => setSelected(s.id)}
              whileHover={{ x: 2 }}
              className={cn(
                "w-full text-left rounded-xl border p-4 transition-all",
                selected === s.id ? "border-[#2563EB]/40 bg-[#2563EB]/8" : "border-white/8 hover:border-white/12",
              )}
              style={{ background: selected === s.id ? undefined : "var(--swop-card)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-sm font-semibold text-white">{s.name}</span>
                </div>
                {s.locked && <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />}
              </div>
              <p className="text-[11px] text-[#94A3B8] mb-3">{s.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs">
                  <span className="text-[#94A3B8]">HC Δ </span>
                  <span className={`font-mono font-semibold ${s.headcountDelta > 0 ? "text-[#34D399]" : "text-[#F87171]"}`}>
                    {s.headcountDelta > 0 ? "+" : ""}{s.headcountDelta}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-[#94A3B8]">Risk </span>
                  <span className={`font-mono font-semibold ${s.riskScore < 0.25 ? "text-[#34D399]" : s.riskScore < 0.35 ? "text-[#FCD34D]" : "text-[#F87171]"}`}>
                    {Math.round(s.riskScore * 100)}/100
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Center: Line items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Line Items — {activeScenario.name}</p>
            <button className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
              <Plus className="w-3 h-3" /> Add Line Item
            </button>
          </div>
          <div className="space-y-2">
            {activeScenario.lineItems.map((li, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/8 p-3 flex items-center gap-3"
                style={{ background: "var(--swop-card)" }}
              >
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: ACTION_COLORS[li.action] + "20", color: ACTION_COLORS[li.action] }}>
                  {li.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium">{li.role}</p>
                  <p className="text-[10px] text-[#94A3B8]">{li.bu} · {li.q}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-white">×{li.qty}</p>
                  <p className={`text-[11px] font-mono ${li.cost < 0 ? "text-[#34D399]" : "text-[#94A3B8]"}`}>
                    {li.cost < 0 ? "-" : "+"}${Math.abs(li.cost / 1000).toFixed(0)}K
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Totals */}
          <div className="rounded-xl border border-white/12 p-3" style={{ background: "rgba(37,99,235,0.05)" }}>
            <div className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">Net HC Change</span>
              <span className={`font-mono font-bold ${activeScenario.headcountDelta > 0 ? "text-[#34D399]" : "text-[#F87171]"}`}>
                {activeScenario.headcountDelta > 0 ? "+" : ""}{activeScenario.headcountDelta} FTEs
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#94A3B8]">Budget Impact</span>
              <span className={`font-mono font-bold ${activeScenario.budgetImpact > 0 ? "text-[#F87171]" : "text-[#34D399]"}`}>
                {activeScenario.budgetImpact > 0 ? "+" : ""}${(activeScenario.budgetImpact / 1_000_000).toFixed(1)}M
              </span>
            </div>
          </div>

          {/* What-If AI */}
          <div className="rounded-xl border border-[#8B5CF6]/20 p-4" style={{ background: "rgba(139,92,246,0.05)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-sm font-semibold text-white">What-If AI Mode</span>
            </div>
            <textarea
              value={whatIf}
              onChange={(e) => setWhatIf(e.target.value)}
              placeholder="What if we grow Sales 30% but automate 40% of SDR functions?"
              className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white resize-none placeholder:text-[#94A3B8]/40 outline-none focus:border-[#8B5CF6]/40"
              rows={2}
            />
            <button
              onClick={handleWhatIf}
              disabled={!whatIf.trim() || aiLoading}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] text-xs hover:bg-[#8B5CF6]/25 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              {aiLoading ? "Analyzing..." : "Run AI Analysis"}
            </button>
          </div>
        </div>

        {/* Right: Comparison + waterfall */}
        <div className="space-y-4">
          <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Scenario Comparison</p>
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-3 py-2 text-left text-[11px] text-[#94A3B8]">Metric</th>
                  {SCENARIOS.map((s) => (
                    <th key={s.id} className={`px-3 py-2 text-right text-[11px] ${selected === s.id ? "text-white" : "text-[#94A3B8]"}`}>
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                        {s.name.split(" ")[0]}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_METRICS.map((row) => (
                  <tr key={row.metric} className="border-b border-white/4 last:border-0">
                    <td className="px-3 py-2 text-[11px] text-[#94A3B8]">{row.metric}</td>
                    <td className="px-3 py-2 text-right text-[11px] font-mono text-white">{row.base}</td>
                    <td className="px-3 py-2 text-right text-[11px] font-mono text-white">{row.optimistic}</td>
                    <td className="px-3 py-2 text-right text-[11px] font-mono text-white">{row.conservative}</td>
                    <td className="px-3 py-2 text-right text-[11px] font-mono text-white">{row.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Waterfall */}
          <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8] mb-3">HC Build-Up: {activeScenario.name}</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={waterfallData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#F1F5F9", fontSize: 11 }}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {waterfallData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
