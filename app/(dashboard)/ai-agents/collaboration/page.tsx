"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Plus, Search, Users, TrendingUp, Zap, ArrowRight, Clock, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BLUEPRINTS = [
  {
    id: "bp_sales_ops_01",
    function: "Sales Operations",
    bu: "Sales",
    status: "complete",
    overallROI: "+34%",
    tasksAugmented: 12,
    rolesRedesigned: 4,
    aiReadiness: 82,
    createdAt: "2d ago",
    topTools: ["Agentforce", "Salesforce Einstein", "Gong AI"],
    summary: "High-value opportunity: SDR prospecting, forecast modeling, and territory planning fully automatable. Human focus shifts to strategic account development.",
  },
  {
    id: "bp_finance_fpa_01",
    function: "FP&A",
    bu: "Finance",
    status: "complete",
    overallROI: "+41%",
    tasksAugmented: 9,
    rolesRedesigned: 3,
    aiReadiness: 75,
    createdAt: "5d ago",
    topTools: ["Anaplan AI", "Workday Prism", "Claude API"],
    summary: "Variance analysis, close cycle automation, and board narrative drafting significantly augmentable. Estimated 40% capacity reclaim for strategic FP&A.",
  },
  {
    id: "bp_cs_support_01",
    function: "Customer Success",
    bu: "Customer Success",
    status: "in_progress",
    overallROI: "+28%",
    tasksAugmented: 7,
    rolesRedesigned: 2,
    aiReadiness: 61,
    createdAt: "1w ago",
    topTools: ["Gainsight AI", "Intercom Fin", "SWOP Copilot"],
    summary: "Tier-1 support and health score monitoring highly automatable. Change management investment needed before deployment.",
  },
  {
    id: "bp_mkt_content_01",
    function: "Content Marketing",
    bu: "Marketing",
    status: "draft",
    overallROI: "+22%",
    tasksAugmented: 6,
    rolesRedesigned: 2,
    aiReadiness: 54,
    createdAt: "2w ago",
    topTools: ["Claude API", "Jasper", "Figma AI"],
    summary: "Content production and performance analysis augmentable. Brand voice calibration required for AI output quality.",
  },
];

const STATUS_CONFIG = {
  complete: { label: "Complete", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  in_progress: { label: "In Progress", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  draft: { label: "Draft", color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
};

const AGGREGATE = {
  totalBlueprints: 4,
  avgROI: "+31%",
  totalTasksAugmented: 34,
  totalRolesRedesigned: 11,
};

export default function CollaborationPage() {
  const [search, setSearch] = useState("");

  const filtered = BLUEPRINTS.filter(
    (b) => b.function.toLowerCase().includes(search.toLowerCase()) || b.bu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
            Human-AI Collaboration Advisor
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            7-stage AI pipeline to redesign every function for the human+agent era
          </p>
        </div>
        <Link href="/ai-agents/collaboration/new">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            New Analysis
          </button>
        </Link>
      </div>

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Blueprints", value: AGGREGATE.totalBlueprints.toString(), icon: Brain, color: "#8B5CF6" },
          { label: "Avg Productivity ROI", value: AGGREGATE.avgROI, icon: TrendingUp, color: "#10B981" },
          { label: "Tasks Augmented", value: AGGREGATE.totalTasksAugmented.toString(), icon: Zap, color: "#F59E0B" },
          { label: "Roles Redesigned", value: AGGREGATE.totalRolesRedesigned.toString(), icon: Users, color: "#60A5FA" },
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by function or business unit..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#8B5CF6]/50 placeholder:text-[#94A3B8]/40"
        />
      </div>

      {/* Blueprint cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((bp, i) => {
          const sc = STATUS_CONFIG[bp.status as keyof typeof STATUS_CONFIG];
          return (
            <motion.div
              key={bp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/ai-agents/collaboration/${bp.id}`}>
                <div className="rounded-xl border border-white/8 p-5 hover:border-[#8B5CF6]/30 transition-all cursor-pointer group"
                  style={{ background: "var(--swop-card)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-[#A78BFA]" />
                        <h3 className="text-sm font-semibold text-white">{bp.function}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">{bp.bu} · {bp.createdAt}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#A78BFA] transition-colors" />
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">{bp.summary}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "ROI", value: bp.overallROI, color: "#10B981" },
                      { label: "Tasks Aug.", value: bp.tasksAugmented.toString(), color: "#F59E0B" },
                      { label: "AI Ready", value: `${bp.aiReadiness}%`, color: "#8B5CF6" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg bg-white/3 p-2.5 text-center">
                        <p className="text-xs text-[#94A3B8]">{m.label}</p>
                        <p className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-[10px] text-[#94A3B8] mb-1.5">AI Tools Recommended</p>
                    <div className="flex flex-wrap gap-1.5">
                      {bp.topTools.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA]">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Start fresh CTA */}
      <Link href="/ai-agents/collaboration/new">
        <div className="rounded-xl border border-dashed border-[#8B5CF6]/25 p-8 flex flex-col items-center justify-center text-center hover:border-[#8B5CF6]/50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-3 group-hover:bg-[#8B5CF6]/20 transition-colors">
            <Plus className="w-6 h-6 text-[#A78BFA]" />
          </div>
          <p className="text-sm font-medium text-white">Analyze a New Function</p>
          <p className="text-xs text-[#94A3B8] mt-1">7-stage AI pipeline · ~2 minutes · Full blueprint output</p>
        </div>
      </Link>
    </div>
  );
}
