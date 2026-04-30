"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, DollarSign, BarChart3, Loader2, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  { id: "plan_fy26_annual", name: "FY2026 Annual Workforce Plan" },
  { id: "plan_fy26_q2", name: "Q2 2026 Headcount Plan" },
  { id: "plan_fy26_ai", name: "AI Transformation Initiative" },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const r = 28, c = 2 * Math.PI * r, dash = (score / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
      <text x="36" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color} fontFamily="JetBrains Mono, monospace">{score}</text>
    </svg>
  );
}

function AgentCard({ title, icon: Icon, findings, score, loading }: { title: string; icon: any; findings: any[]; score: number; loading: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#60A5FA]" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#94A3B8]" /> : <ScoreRing score={score} />}
      </div>
      <div className="space-y-2">
        {findings.map((f, i) => (
          <div key={i} className={cn("rounded-lg p-3 text-sm", f.severity === "high" || f.severity === "critical" ? "bg-[#EF4444]/8 border border-[#EF4444]/20" : f.severity === "medium" ? "bg-[#F59E0B]/8 border border-[#F59E0B]/20" : "bg-white/3 border border-white/6")}>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className={cn("w-3 h-3", f.severity === "high" || f.severity === "critical" ? "text-[#F87171]" : f.severity === "medium" ? "text-[#FCD34D]" : "text-[#94A3B8]")} />
              <span className="text-xs font-semibold text-white">{f.category}</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_RESULT = {
  riskFindings: {
    score: 61,
    findings: [
      { category: "Hiring Lead Time", severity: "high", description: "Q2 plan assumes 45-day TTF for Engineering L5+ roles; current TTF is 82 days." },
      { category: "Concentration Risk", severity: "medium", description: "68% of Q2 hires target San Francisco — consider distribution risk." },
      { category: "Succession Gap", severity: "medium", description: "VP Marketing has no identified L-1 successor." },
    ],
  },
  budgetFindings: {
    score: 78,
    findings: [
      { category: "Benefits Loading", severity: "medium", description: "Benefits loading factor at 18% — industry standard for SaaS is 22-25%. Restate costs." },
      { category: "Sign-on Budget", severity: "low", description: "No sign-on budget allocated for ML Engineer hires. Expect 15-20% of base for competitive market." },
    ],
  },
  benchmarkFindings: {
    score: 82,
    findings: [
      { category: "Revenue per Employee", severity: "low", description: "$215K RPE vs SaaS median $195K — healthy." },
      { category: "Span of Control", severity: "low", description: "Engineering avg span 7.2 — within benchmark range 6-9." },
    ],
  },
  conflicts: [{ description: "Risk Auditor flagged HIGH on TTF assumptions; Benchmark Comparator says TTF is normal for market. Recommend: accept Risk finding — Acme's TTF specifically has been running slow, not market average." }],
  overallScore: 72,
  recommendation: "Approve with modifications: revise hiring lead time assumptions to 75 days for Engineering and increase benefits loading factor to 23%.",
};

export default function PlanReviewPage() {
  const [planId, setPlanId] = useState(PLANS[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);
  const [agentStates, setAgentStates] = useState({ risk: false, budget: false, benchmark: false });

  const runReview = async () => {
    setLoading(true);
    setResult(null);
    setAgentStates({ risk: true, budget: true, benchmark: true });

    // Simulate agents completing one by one
    setTimeout(() => setAgentStates((s) => ({ ...s, risk: false })), 4000);
    setTimeout(() => setAgentStates((s) => ({ ...s, budget: false })), 6500);
    setTimeout(() => {
      setAgentStates({ risk: false, budget: false, benchmark: false });
      setResult(MOCK_RESULT);
      setLoading(false);
    }, 9000);

    // In production, would call the actual API
    // const resp = await fetch("/api/ai/plan-review", { method: "POST", body: JSON.stringify({ planId }) });
    // const data = await resp.json(); setResult(data);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Multi-Agent Plan Review</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Three specialized sub-agents review your plan independently, then resolve conflicts</p>
      </div>

      <div className="flex items-center gap-3">
        <select value={planId} onChange={(e) => setPlanId(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 flex-1 max-w-sm">
          {PLANS.map((p) => <option key={p.id} value={p.id} className="bg-[#1A2235]">{p.name}</option>)}
        </select>
        <button onClick={runReview} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {loading ? "Reviewing..." : "Run Multi-Agent Review"}
        </button>
      </div>

      {(loading || result) && (
        <div className="space-y-4">
          {loading && (
            <div className="rounded-xl border border-[#8B5CF6]/25 p-4 bg-[#8B5CF6]/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] agent-active" />
                <span className="text-sm text-[#A78BFA]">Agents running in parallel...</span>
              </div>
              <div className="flex gap-3">
                {[
                  { label: "Risk Auditor", loading: agentStates.risk },
                  { label: "Budget Validator", loading: agentStates.budget },
                  { label: "Benchmark Comparator", loading: agentStates.benchmark },
                ].map((a) => (
                  <div key={a.label} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs", a.loading ? "border-[#8B5CF6]/30 text-[#A78BFA]" : "border-[#10B981]/30 text-[#34D399]")}>
                    {a.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Overall score */}
              <div className="rounded-xl border border-white/8 p-5 flex items-center gap-6" style={{ background: "var(--swop-card)" }}>
                <ScoreRing score={result.overallScore} />
                <div>
                  <p className="text-xs text-[#94A3B8] mb-1">Overall Plan Health</p>
                  <p className="text-lg font-semibold text-white">{result.recommendation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AgentCard title="Risk Auditor" icon={Shield} findings={result.riskFindings.findings} score={result.riskFindings.score} loading={false} />
                <AgentCard title="Budget Validator" icon={DollarSign} findings={result.budgetFindings.findings} score={result.budgetFindings.score} loading={false} />
                <AgentCard title="Benchmark Comparator" icon={BarChart3} findings={result.benchmarkFindings.findings} score={result.benchmarkFindings.score} loading={false} />
              </div>

              {result.conflicts.length > 0 && (
                <div className="rounded-xl border border-[#F59E0B]/25 p-4 bg-[#F59E0B]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-[#FCD34D]" />
                    <span className="text-sm font-semibold text-white">Conflict Resolver</span>
                  </div>
                  {result.conflicts.map((c, i) => (
                    <p key={i} className="text-sm text-[#94A3B8]">{c.description}</p>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#10B981] text-white text-sm font-medium hover:bg-[#059669] transition-colors">Approve Plan</button>
                <button className="px-4 py-2 rounded-lg border border-[#F59E0B]/30 text-[#FCD34D] text-sm hover:bg-[#F59E0B]/10 transition-colors">Return for Revision</button>
                <button className="px-4 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">Escalate</button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {!loading && !result && (
        <div className="rounded-xl border border-white/8 p-12 flex flex-col items-center justify-center text-center" style={{ background: "var(--swop-card)" }}>
          <div className="flex gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#94A3B8]/30" />
            <DollarSign className="w-8 h-8 text-[#94A3B8]/30" />
            <BarChart3 className="w-8 h-8 text-[#94A3B8]/30" />
          </div>
          <p className="text-sm text-[#94A3B8]">Select a plan and run the multi-agent review</p>
          <p className="text-xs text-[#94A3B8]/50 mt-1">Risk Auditor · Budget Validator · Benchmark Comparator run in parallel (~15 seconds)</p>
        </div>
      )}
    </div>
  );
}
