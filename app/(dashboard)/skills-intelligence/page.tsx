"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertTriangle, ArrowRight, CheckCircle, Plus } from "lucide-react";

const SKILLS = [
  { skillName: "Agentforce / AI Agent Orchestration", category: "AI/ML", currentCount: 5, targetCount: 60, gapScore: 0.92, aiRiskScore: 0.05 },
  { skillName: "LLM Integration", category: "AI/ML", currentCount: 18, targetCount: 85, gapScore: 0.79, aiRiskScore: 0.05 },
  { skillName: "MLOps / Model Deployment", category: "AI/ML", currentCount: 12, targetCount: 55, gapScore: 0.78, aiRiskScore: 0.10 },
  { skillName: "Generative AI / Prompt Engineering", category: "AI/ML", currentCount: 42, targetCount: 120, gapScore: 0.65, aiRiskScore: 0.05 },
  { skillName: "Change Management", category: "HR/OD", currentCount: 22, targetCount: 65, gapScore: 0.66, aiRiskScore: 0.12 },
  { skillName: "Data Science & Analytics", category: "Data", currentCount: 95, targetCount: 140, gapScore: 0.32, aiRiskScore: 0.35 },
  { skillName: "Enterprise Sales (MEDDIC)", category: "Sales", currentCount: 182, targetCount: 220, gapScore: 0.17, aiRiskScore: 0.22 },
  { skillName: "Salesforce / CRM Admin", category: "RevOps", currentCount: 68, targetCount: 90, gapScore: 0.24, aiRiskScore: 0.50 },
  { skillName: "Cloud Architecture", category: "Engineering", currentCount: 198, targetCount: 240, gapScore: 0.18, aiRiskScore: 0.15 },
  { skillName: "Executive Storytelling", category: "Leadership", currentCount: 88, targetCount: 130, gapScore: 0.32, aiRiskScore: 0.08 },
  { skillName: "Financial Planning & Analysis", category: "Finance", currentCount: 55, targetCount: 72, gapScore: 0.24, aiRiskScore: 0.45 },
  { skillName: "Customer Success Management", category: "CS", currentCount: 142, targetCount: 180, gapScore: 0.21, aiRiskScore: 0.30 },
];

const SUCCESSION = [
  { role: "CTO", readyNow: 1, readyIn12: 2, none: 0, risk: "low" },
  { role: "VP Sales", readyNow: 0, readyIn12: 1, none: 0, risk: "medium" },
  { role: "VP Marketing", readyNow: 0, readyIn12: 0, none: 1, risk: "high" },
  { role: "VP Customer Success", readyNow: 1, readyIn12: 1, none: 0, risk: "low" },
  { role: "Engineering Manager - Platform", readyNow: 0, readyIn12: 2, none: 0, risk: "medium" },
  { role: "ML Engineering Manager", readyNow: 0, readyIn12: 0, none: 1, risk: "high" },
  { role: "Controller", readyNow: 0, readyIn12: 1, none: 0, risk: "medium" },
];

const SCATTER_DATA = SKILLS.map((s) => ({
  x: Math.round(s.aiRiskScore * 100),
  y: Math.round((1 - s.gapScore) * 100),
  z: s.currentCount,
  name: s.skillName,
  category: s.category,
}));

const QUADRANT_COLORS = ["#10B981", "#2563EB", "#F59E0B", "#EF4444"];

const TABS = ["Skills Heat Map", "Gap Analysis", "AI Risk Assessment", "Succession Map"] as const;
type Tab = typeof TABS[number];

export default function SkillsIntelligencePage() {
  const [tab, setTab] = useState<Tab>("Skills Heat Map");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Skills Intelligence</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Skills gaps, automation risk, and succession depth</p>
      </div>

      <div className="flex gap-1 border-b border-white/8 pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px",
              tab === t ? "border-[#2563EB] text-white" : "border-transparent text-[#94A3B8] hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Skills Heat Map" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
            <div className="grid grid-cols-5 border-b border-white/8">
              <div className="px-4 py-2.5 text-xs text-[#94A3B8] font-semibold">Skill</div>
              <div className="px-4 py-2.5 text-xs text-[#94A3B8] font-semibold">Category</div>
              <div className="px-4 py-2.5 text-xs text-[#94A3B8] font-semibold">Have / Need</div>
              <div className="px-4 py-2.5 text-xs text-[#94A3B8] font-semibold">Gap Score</div>
              <div className="px-4 py-2.5 text-xs text-[#94A3B8] font-semibold">AI Risk</div>
            </div>
            {SKILLS.sort((a, b) => b.gapScore - a.gapScore).map((s, i) => {
              const gapColor = s.gapScore > 0.7 ? "#EF4444" : s.gapScore > 0.4 ? "#F59E0B" : s.gapScore > 0.2 ? "#0EA5E9" : "#10B981";
              const aiColor = s.aiRiskScore > 0.5 ? "#EF4444" : s.aiRiskScore > 0.3 ? "#F59E0B" : "#10B981";
              return (
                <motion.div
                  key={s.skillName}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-5 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors items-center"
                >
                  <div className="px-4 py-3 text-sm text-white font-medium">{s.skillName}</div>
                  <div className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-[#94A3B8]">{s.category}</span>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/8">
                        <div className="h-full rounded-full" style={{ width: `${(s.currentCount / s.targetCount) * 100}%`, background: gapColor }} />
                      </div>
                      <span className="text-[11px] font-mono text-[#94A3B8] whitespace-nowrap">{s.currentCount}/{s.targetCount}</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm font-mono font-bold" style={{ color: gapColor }}>{Math.round(s.gapScore * 100)}%</span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm font-mono" style={{ color: aiColor }}>{Math.round(s.aiRiskScore * 100)}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {tab === "Gap Analysis" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {SKILLS.filter((s) => s.gapScore > 0.3).sort((a, b) => b.gapScore - a.gapScore).map((s, i) => {
            const pct = Math.round((s.currentCount / s.targetCount) * 100);
            const monthsToClose = Math.round((s.targetCount - s.currentCount) / Math.max(s.currentCount * 0.02, 1));
            const reco = s.gapScore > 0.7 ? "Buy (External Hire)" : s.gapScore > 0.4 ? "Build (Training)" : "Borrow (Contract)";
            const recoColor = s.gapScore > 0.7 ? "#EF4444" : s.gapScore > 0.4 ? "#F59E0B" : "#10B981";
            return (
              <motion.div key={s.skillName} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{s.skillName}</h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.category} · {s.currentCount} have · {s.targetCount} needed</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#94A3B8]">Gap</div>
                    <div className="text-xl font-bold font-mono text-[#F87171]">{100 - pct}%</div>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/8 mb-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.06 }}
                    className="h-full rounded-full" style={{ background: pct > 70 ? "#10B981" : pct > 40 ? "#F59E0B" : "#EF4444" }} />
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-xs text-[#94A3B8]">⏱ ~{monthsToClose} months to close at current pace</div>
                  <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: recoColor }}>
                    <ArrowRight className="w-3 h-3" /> {reco}
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white transition-colors">Create Req</button>
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-[#2563EB]/30 text-[#60A5FA] hover:bg-[#2563EB]/10 transition-colors">Learning Plan</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {tab === "AI Risk Assessment" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-4 gap-3 mb-2">
            {[
              { label: "Protect & Develop", color: "#10B981", desc: "High value, high AI risk → Augment" },
              { label: "Invest", color: "#2563EB", desc: "High value, low AI risk → Grow" },
              { label: "Transition", color: "#F59E0B", desc: "Low value, high AI risk → Retrain" },
              { label: "Optimize", color: "#EF4444", desc: "Low value, low AI risk → Automate" },
            ].map((q) => (
              <div key={q.label} className="rounded-lg border border-white/8 p-3" style={{ background: "var(--swop-card)" }}>
                <div className="w-3 h-3 rounded-full mb-2" style={{ background: q.color }} />
                <p className="text-xs font-semibold text-white">{q.label}</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">{q.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8] mb-1">X-axis: Automation Risk · Y-axis: Current Coverage · Bubble size: Current headcount</p>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="x" name="AI Risk" type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} label={{ value: "Automation Risk %", position: "insideBottom", fill: "#94A3B8", fontSize: 11, dy: 15 }} />
                <YAxis dataKey="y" name="Coverage" type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} label={{ value: "Coverage %", angle: -90, position: "insideLeft", fill: "#94A3B8", fontSize: 11 }} />
                <ZAxis dataKey="z" range={[30, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  formatter={(v: any, name: any) => [`${v}%`, name === "x" ? "AI Risk" : name === "y" ? "Coverage" : "Count"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
                />
                <Scatter data={SCATTER_DATA}>
                  {SCATTER_DATA.map((entry, i) => {
                    const color = entry.x > 50 && entry.y > 50 ? "#10B981" : entry.x < 50 && entry.y > 50 ? "#2563EB" : entry.x > 50 ? "#F59E0B" : "#EF4444";
                    return <Cell key={i} fill={color} fillOpacity={0.7} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {tab === "Succession Map" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-5 py-3 text-left text-xs text-[#94A3B8] font-semibold">Role (Director+)</th>
                  <th className="px-5 py-3 text-center text-xs text-[#34D399] font-semibold">Ready Now</th>
                  <th className="px-5 py-3 text-center text-xs text-[#FCD34D] font-semibold">Ready in 12mo</th>
                  <th className="px-5 py-3 text-center text-xs text-[#F87171] font-semibold">No Successor</th>
                  <th className="px-5 py-3 text-center text-xs text-[#94A3B8] font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {SUCCESSION.map((row, i) => (
                  <motion.tr key={row.role} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                    className="border-b border-white/4 last:border-0 hover:bg-white/2">
                    <td className="px-5 py-3 text-sm text-white font-medium">{row.role}</td>
                    <td className="px-5 py-3 text-center">
                      {row.readyNow > 0 ? <span className="text-sm font-bold text-[#34D399]">{row.readyNow}</span> : <span className="text-[#94A3B8]/40">—</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.readyIn12 > 0 ? <span className="text-sm font-bold text-[#FCD34D]">{row.readyIn12}</span> : <span className="text-[#94A3B8]/40">—</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.none > 0 ? <span className="text-sm font-bold text-[#F87171]">{row.none}</span> : <span className="text-[#94A3B8]/40">—</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.risk === "high" ? "bg-[#EF4444]/15 text-[#F87171]" : row.risk === "medium" ? "bg-[#F59E0B]/15 text-[#FCD34D]" : "bg-[#10B981]/15 text-[#34D399]"}`}>
                        {row.risk}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#94A3B8]">
            <AlertTriangle className="w-4 h-4 text-[#F87171]" />
            2 critical succession gaps identified — VP Marketing and ML Engineering Manager have no identified successors.
            <button className="ml-auto text-[#2563EB] hover:underline">Export for Board</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
