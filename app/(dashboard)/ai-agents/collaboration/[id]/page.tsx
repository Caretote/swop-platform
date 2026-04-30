"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, TrendingUp, Users, Wrench, Map, BarChart3, AlertTriangle,
  CheckCircle, ArrowRight, Download, ChevronRight, Zap, Clock,
  DollarSign, Shield, Lightbulb, Target
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

// Mock blueprint data for Sales Operations
const BLUEPRINT = {
  id: "bp_sales_ops_01",
  function: "Sales Operations",
  bu: "Sales",
  createdAt: "April 26, 2026",
  overallROI: "+34%",
  aiReadinessScore: 82,
  tasksTotal: 18,
  tasksAugmented: 12,
  rolesTotal: 8,
  rolesRedesigned: 4,
  estimatedCapacityGain: "38%",
  implementation: { weeks: 16, phases: 3, investment: "$280K", payback: "8 months" },

  taskAugmentations: [
    { task: "SDR Prospect Research", current: "Manual LinkedIn + ZoomInfo search", mode: "AI-DO", aiConfidence: 0.91, timeSaved: "4h/day", tool: "Agentforce Prospecting", notes: "Fully automatable. Agent handles enrichment, scoring, and sequencing." },
    { task: "Pipeline Forecast Modeling", current: "Analyst builds weekly in Excel", mode: "AI-DO", aiConfidence: 0.85, timeSaved: "6h/week", tool: "Salesforce Einstein Forecasting", notes: "AI generates variance analysis and scenario models automatically." },
    { task: "Territory Planning", current: "VP-led annual exercise", mode: "ASSIST", aiConfidence: 0.78, timeSaved: "2d/quarter", tool: "Salesforce Maps + AI", notes: "AI proposes optimal territory splits; human reviews for relationship factors." },
    { task: "Quote Generation", current: "AE manually builds in CPQ", mode: "ASSIST", aiConfidence: 0.82, timeSaved: "45min/deal", tool: "Salesforce CPQ + Einstein", notes: "AI drafts quote with recommended discount tier; AE approves." },
    { task: "Win/Loss Analysis", current: "Quarterly manual interviews", mode: "ASSIST", aiConfidence: 0.74, timeSaved: "3d/quarter", tool: "Gong AI + Claude", notes: "AI analyzes call transcripts at scale; human draws strategic insights." },
    { task: "Account Health Scoring", current: "CSM gut feel + spreadsheet", mode: "AI-DO", aiConfidence: 0.88, timeSaved: "8h/week", tool: "Gainsight AI", notes: "AI monitors 40+ signals continuously; surfaces risk and expansion." },
    { task: "Commission Calculation", current: "RevOps manual monthly close", mode: "AI-DO", aiConfidence: 0.95, timeSaved: "3d/month", tool: "Salesforce Spiff", notes: "Fully deterministic — perfect AI-DO candidate with audit trail." },
    { task: "Sales Coaching", current: "Manager reviews recordings weekly", mode: "ASSIST", aiConfidence: 0.72, timeSaved: "2h/rep/week", tool: "Gong AI + Chorus", notes: "AI identifies coaching moments; human delivers context-aware feedback." },
    { task: "Competitive Analysis", current: "PMM quarterly deck", mode: "ASSIST", aiConfidence: 0.69, timeSaved: "4d/quarter", tool: "Claude API + Crayon", notes: "AI monitors signals continuously; human validates strategic framing." },
    { task: "Onboarding Curriculum", current: "Enablement team builds manually", mode: "ASSIST", aiConfidence: 0.75, timeSaved: "1wk/quarter", tool: "Highspot AI", notes: "AI personalizes learning path per rep profile; human ensures culture fit." },
    { task: "Deal Desk Review", current: "Finance + Legal manual review", mode: "CHECK", aiConfidence: 0.58, timeSaved: "30min/deal", tool: "Claude + internal policy", notes: "AI flags non-standard terms; human makes final approval." },
    { task: "Strategic Account Planning", current: "AE + HRBP quarterly workshop", mode: "AVOID", aiConfidence: 0.31, timeSaved: "0", tool: "N/A", notes: "Relationship strategy requires executive judgment. Do not automate." },
  ],

  roleRedesigns: [
    { role: "Sales Development Rep", from: "Manual prospecting, 60% admin", to: "AI-augmented, 80% conversations", newTitle: "Revenue Development Agent", skillsAdded: ["AI prompt engineering", "Conversation design", "Signal interpretation"], capacityGain: "+65%" },
    { role: "Sales Operations Analyst", from: "Report builder, data wrangler", to: "AI insights interpreter, strategic advisor", newTitle: "Sales Intelligence Lead", skillsAdded: ["AI model evaluation", "Business storytelling", "Change management"], capacityGain: "+40%" },
    { role: "Revenue Operations Manager", from: "Process admin, system config", to: "AI pipeline architect, enablement lead", newTitle: "AI Revenue Architect", skillsAdded: ["Agentforce administration", "AI ops management", "ROI measurement"], capacityGain: "+30%" },
    { role: "Sales Enablement Manager", from: "Content creator, LMS admin", to: "Learning experience designer, AI curriculum owner", newTitle: "AI Enablement Designer", skillsAdded: ["Instructional AI design", "Personalization strategy", "Impact measurement"], capacityGain: "+45%" },
  ],

  toolingStack: [
    { name: "Agentforce", vendor: "Salesforce", category: "Agent Orchestration", priority: "P0", cost: "$$$", integration: "Native CRM", readiness: 90 },
    { name: "Einstein Forecasting", vendor: "Salesforce", category: "Predictive Analytics", priority: "P0", cost: "$$", integration: "Native CRM", readiness: 85 },
    { name: "Gong AI", vendor: "Gong", category: "Conversation Intelligence", priority: "P1", cost: "$$", integration: "API + CRM", readiness: 78 },
    { name: "Claude API", vendor: "Anthropic", category: "LLM Foundation", priority: "P1", cost: "$$", integration: "Custom wrapper", readiness: 82 },
    { name: "Salesforce CPQ+", vendor: "Salesforce", category: "Configure-Price-Quote", priority: "P1", cost: "$$$", integration: "Native CRM", readiness: 70 },
    { name: "Highspot AI", vendor: "Highspot", category: "Sales Enablement", priority: "P2", cost: "$$", integration: "API", readiness: 65 },
  ],

  roadmap: [
    { phase: 1, name: "Foundation", weeks: "W1–W4", milestones: ["AI audit of current state", "Agentforce sandbox setup", "Pilot team selection (8 reps)", "Data quality baseline"], risk: "LOW" },
    { phase: 2, name: "Augmentation", weeks: "W5–W12", milestones: ["SDR prospecting automation go-live", "Einstein Forecasting activation", "Gong AI coaching deployment", "Commission automation launch"], risk: "MEDIUM" },
    { phase: 3, name: "Transform", weeks: "W13–W16", milestones: ["Full role redesign implementations", "AI Readiness certification program", "ROI measurement framework live", "Org-wide rollout"], risk: "LOW" },
  ],

  productivityROI: {
    capacityReclaimed: 38,
    annualTimeSaved: 2840,
    annualCostSaved: 412000,
    revenueImpact: "+$1.2M",
    breakeven: "8 months",
    radarData: [
      { metric: "Prospecting", before: 40, after: 88 },
      { metric: "Forecasting", before: 55, after: 91 },
      { metric: "Coaching", before: 45, after: 78 },
      { metric: "Analysis", before: 35, after: 82 },
      { metric: "Enablement", before: 50, after: 75 },
    ],
  },

  antiPatterns: [
    { pattern: "Automating Relationship-Critical Tasks", severity: "critical", affected: "Strategic Account Planning", risk: "Loss of enterprise trust, churn risk", recommendation: "Keep account planning 100% human. AI can prepare context briefings, not replace relationship strategy." },
    { pattern: "Over-indexing on AI-DO Mode", severity: "high", affected: "Deal Desk Review", risk: "Non-standard deals slip through; compliance exposure", recommendation: "Maintain CHECK mode for any deal >$200K or with custom legal terms." },
    { pattern: "Skipping Change Management", severity: "high", affected: "SDR team adoption", risk: "Shadow tools, workarounds, low adoption", recommendation: "Invest 15% of budget in change management. Certify reps before go-live." },
    { pattern: "Single Vendor Lock-in", severity: "medium", affected: "Agentforce dependency", risk: "Pricing leverage, feature gaps", recommendation: "Maintain Claude API as orchestration fallback. Evaluate Agentforce annually." },
    { pattern: "Ignoring Data Quality Prerequisites", severity: "medium", affected: "Einstein Forecasting accuracy", risk: "Garbage-in, garbage-out — AI predictions worse than human intuition", recommendation: "Run 6-week data quality sprint before activating forecasting AI." },
  ],
};

const MODE_STYLES = {
  "AI-DO": { label: "AI-DO", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  "ASSIST": { label: "ASSIST", color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)" },
  "CHECK": { label: "CHECK", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  "AVOID": { label: "AVOID", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

const SEVERITY_CONFIG = {
  critical: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  high: { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)" },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
};

const TABS = [
  { id: "tasks", label: "Task Augmentation", icon: Zap },
  { id: "roles", label: "Role Redesigns", icon: Users },
  { id: "tooling", label: "Tooling Stack", icon: Wrench },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "roi", label: "Productivity ROI", icon: BarChart3 },
  { id: "antipatterns", label: "Anti-Patterns", icon: AlertTriangle },
];

export default function BlueprintDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState("tasks");
  const [roiSlider, setRoiSlider] = useState(100);

  const bp = BLUEPRINT;
  const sliderFactor = roiSlider / 100;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-[#A78BFA]" />
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
              {bp.function} Blueprint
            </h1>
          </div>
          <p className="text-sm text-[#94A3B8]">{bp.bu} · Analyzed {bp.createdAt}</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors">
          <Download className="w-4 h-4" />
          Export Blueprint
        </button>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: "Productivity ROI", value: bp.overallROI, color: "#10B981" },
          { label: "AI Readiness", value: `${bp.aiReadinessScore}%`, color: "#8B5CF6" },
          { label: "Tasks Augmented", value: `${bp.tasksAugmented}/${bp.tasksTotal}`, color: "#F59E0B" },
          { label: "Roles Redesigned", value: `${bp.rolesRedesigned}/${bp.rolesTotal}`, color: "#60A5FA" },
          { label: "Capacity Gain", value: bp.estimatedCapacityGain, color: "#34D399" },
          { label: "Payback Period", value: bp.implementation.payback, color: "#F97316" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-white/8 p-3" style={{ background: "var(--swop-card)" }}>
            <p className="text-[10px] text-[#94A3B8]">{k.label}</p>
            <p className="text-lg font-bold font-mono mt-0.5" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              tab === t.id
                ? "bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30"
                : "text-[#94A3B8] hover:text-white"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* TASK AUGMENTATION */}
        {tab === "tasks" && (
          <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              {Object.entries(MODE_STYLES).map(([mode, s]) => (
                <div key={mode} className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium" style={{ color: s.color, background: s.bg, borderColor: s.border }}>{s.label}</span>
                  <span className="text-[10px] text-[#94A3B8]">{mode === "AI-DO" ? "Fully automated" : mode === "ASSIST" ? "AI-assisted" : mode === "CHECK" ? "AI advises, human decides" : "Keep human"}</span>
                </div>
              ))}
            </div>
            {bp.taskAugmentations.map((t, i) => {
              const ms = MODE_STYLES[t.mode as keyof typeof MODE_STYLES];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ color: ms.color, background: ms.bg, borderColor: ms.border }}>{ms.label}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{t.task}</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">Current: {t.current}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {t.timeSaved !== "0" && (
                            <p className="text-xs font-medium text-[#10B981]">Saves {t.timeSaved}</p>
                          )}
                          <p className="text-[10px] text-[#94A3B8] mt-0.5 font-mono">{Math.round(t.aiConfidence * 100)}% confidence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/20">{t.tool}</span>
                        <p className="text-[11px] text-[#94A3B8]">{t.notes}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ROLE REDESIGNS */}
        {tab === "roles" && (
          <motion.div key="roles" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {bp.roleRedesigns.map((r, i) => (
              <div key={i} className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-[#94A3B8] mb-1">Current Role</p>
                        <p className="text-sm font-semibold text-white">{r.role}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                      <div className="text-center">
                        <p className="text-xs text-[#94A3B8] mb-1">Redesigned Role</p>
                        <p className="text-sm font-semibold text-[#A78BFA]">{r.newTitle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="rounded-lg bg-white/3 p-3">
                        <p className="text-[10px] text-[#94A3B8] mb-1">Before</p>
                        <p className="text-xs text-[#94A3B8]">{r.from}</p>
                      </div>
                      <div className="rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 p-3">
                        <p className="text-[10px] text-[#A78BFA] mb-1">After</p>
                        <p className="text-xs text-white">{r.to}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8] mb-1.5">New Skills Required</p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.skillsAdded.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399]">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-[10px] text-[#94A3B8] mb-1">Capacity Gain</p>
                    <p className="text-2xl font-bold font-mono text-[#10B981]">{r.capacityGain}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TOOLING STACK */}
        {tab === "tooling" && (
          <motion.div key="tooling" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {bp.toolingStack.map((tool, i) => (
              <div key={i} className="rounded-xl border border-white/8 p-4 flex items-center gap-4" style={{ background: "var(--swop-card)" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{tool.name}</p>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium",
                      tool.priority === "P0" ? "border-[#EF4444]/30 text-[#F87171] bg-[#EF4444]/10" :
                        tool.priority === "P1" ? "border-[#F59E0B]/30 text-[#FCD34D] bg-[#F59E0B]/10" :
                          "border-white/15 text-[#94A3B8]"
                    )}>{tool.priority}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{tool.vendor} · {tool.category} · {tool.integration}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[#94A3B8] mb-1">Readiness</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-white/8">
                      <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: `${tool.readiness}%` }} />
                    </div>
                    <span className="text-xs font-mono text-[#A78BFA]">{tool.readiness}%</span>
                  </div>
                </div>
                <div className="text-[#94A3B8] font-mono text-xs">{tool.cost}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ROADMAP */}
        {tab === "roadmap" && (
          <motion.div key="roadmap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: "Timeline", value: `${bp.implementation.weeks} weeks` },
                { label: "Investment", value: bp.implementation.investment },
                { label: "Payback", value: bp.implementation.payback },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/8 p-4 text-center" style={{ background: "var(--swop-card)" }}>
                  <p className="text-xs text-[#94A3B8]">{s.label}</p>
                  <p className="text-xl font-bold font-mono text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>
            {bp.roadmap.map((phase, i) => (
              <div key={i} className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/6">
                  <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#A78BFA]">{phase.phase}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{phase.name}</p>
                    <p className="text-xs text-[#94A3B8]">{phase.weeks}</p>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                    phase.risk === "LOW" ? "border-[#10B981]/25 text-[#34D399] bg-[#10B981]/10" :
                      "border-[#F59E0B]/25 text-[#FCD34D] bg-[#F59E0B]/10"
                  )}>{phase.risk} risk</span>
                </div>
                <div className="p-5 space-y-2">
                  {phase.milestones.map((m) => (
                    <div key={m} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#94A3B8]">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* PRODUCTIVITY ROI */}
        {tab === "roi" && (
          <motion.div key="roi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Slider */}
            <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Adoption Rate Scenario</h3>
                <span className="text-sm font-bold font-mono text-[#A78BFA]">{roiSlider}%</span>
              </div>
              <input
                type="range" min={25} max={100} value={roiSlider}
                onChange={(e) => setRoiSlider(+e.target.value)}
                className="w-full accent-[#8B5CF6]"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                <span>Conservative (25%)</span>
                <span>Moderate (60%)</span>
                <span>Full (100%)</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Capacity Reclaimed", value: `${Math.round(bp.productivityROI.capacityReclaimed * sliderFactor)}%`, color: "#10B981" },
                { label: "Hours Saved/Year", value: Math.round(bp.productivityROI.annualTimeSaved * sliderFactor).toLocaleString(), color: "#60A5FA" },
                { label: "Annual Cost Savings", value: `$${Math.round(bp.productivityROI.annualCostSaved * sliderFactor / 1000)}K`, color: "#F59E0B" },
                { label: "Revenue Impact", value: bp.productivityROI.revenueImpact, color: "#34D399" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-white/8 p-4 text-center" style={{ background: "var(--swop-card)" }}>
                  <p className="text-xs text-[#94A3B8]">{m.label}</p>
                  <p className="text-2xl font-bold font-mono mt-1" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Radar */}
            <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
              <h3 className="text-sm font-semibold text-white mb-4">Capability Uplift by Process Area</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={bp.productivityROI.radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <Radar name="Before AI" dataKey="before" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.15} />
                  <Radar name="After AI" dataKey="after" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 justify-center mt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#94A3B8]" /><span className="text-xs text-[#94A3B8]">Before</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#8B5CF6]" /><span className="text-xs text-[#94A3B8]">After AI</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ANTI-PATTERNS */}
        {tab === "antipatterns" && (
          <motion.div key="antipatterns" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-xl border border-[#F59E0B]/20 p-3 bg-[#F59E0B]/5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FCD34D] shrink-0 mt-0.5" />
              <p className="text-xs text-[#94A3B8]">Anti-patterns detected by the AI audit. Address these before deployment to prevent implementation failure.</p>
            </div>
            {bp.antiPatterns.map((ap, i) => {
              const sc = SEVERITY_CONFIG[ap.severity as keyof typeof SEVERITY_CONFIG];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-xl border p-5" style={{ background: "var(--swop-card)", borderColor: sc.border }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: sc.color }} />
                      <h3 className="text-sm font-semibold text-white">{ap.pattern}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase shrink-0"
                      style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}>{ap.severity}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/3 p-3">
                      <p className="text-[10px] text-[#94A3B8] mb-1">Affected Area</p>
                      <p className="text-xs text-white">{ap.affected}</p>
                    </div>
                    <div className="rounded-lg bg-white/3 p-3">
                      <p className="text-[10px] text-[#94A3B8] mb-1">Risk</p>
                      <p className="text-xs text-[#F87171]">{ap.risk}</p>
                    </div>
                    <div className="rounded-lg bg-[#10B981]/5 border border-[#10B981]/15 p-3">
                      <p className="text-[10px] text-[#34D399] mb-1">Recommendation</p>
                      <p className="text-xs text-white">{ap.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
