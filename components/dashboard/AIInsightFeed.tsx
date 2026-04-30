"use client";

import { motion } from "framer-motion";
import { Bot, AlertTriangle, TrendingUp, Lightbulb, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const INSIGHTS = [
  {
    id: "1",
    type: "risk",
    icon: AlertTriangle,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    title: "Attrition spike detected in Sales L2-L3",
    body: "SDR cohort shows 68% flight risk — 3 drivers: below-market comp, limited promo velocity, manager change. Recommend immediate compensation review.",
    action: "View Attrition Analysis",
    href: "/ai-agents/attrition",
    age: "2h ago",
  },
  {
    id: "2",
    type: "opportunity",
    icon: Lightbulb,
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    title: "Agentforce can offset 4.2 SDR FTEs in Sales",
    body: "Based on Sales Ops analysis, AI agents can automate 68% of SDR prospecting tasks, saving $820K/yr. Collaboration blueprint ready for review.",
    action: "View Blueprint",
    href: "/ai-agents/collaboration",
    age: "6h ago",
  },
  {
    id: "3",
    type: "insight",
    icon: TrendingUp,
    color: "#2563EB",
    bg: "rgba(37,99,235,0.1)",
    title: "Q2 hiring pace tracking 12% behind plan",
    body: "Engineering ML roles have 82-day avg TTF vs 45-day plan assumption. At current pace, Q2 headcount target will miss by 14 FTEs.",
    action: "Update Scenario",
    href: "/headcount/scenarios",
    age: "1d ago",
  },
];

export function AIInsightFeed() {
  return (
    <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-[#A78BFA]" />
          </div>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>AI Insight Feed</h3>
        </div>
        <span className="text-[11px] text-[#94A3B8]">3 new insights</span>
      </div>

      <div className="space-y-3">
        {INSIGHTS.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-white/6 p-3 hover:border-white/10 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg shrink-0" style={{ background: insight.bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-white leading-tight">{insight.title}</p>
                    <span className="text-[10px] text-[#94A3B8]/60 shrink-0">{insight.age}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">{insight.body}</p>
                  <a href={insight.href} className="inline-flex items-center gap-1 mt-2 text-[11px] hover:underline transition-colors" style={{ color: insight.color }}>
                    {insight.action} <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
