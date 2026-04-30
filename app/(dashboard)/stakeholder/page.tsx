"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation, Download, Plus, ChevronRight, Eye, Share2,
  BarChart3, Users, Brain, TrendingUp, Shield, Layers,
  Check, Loader2, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDE_TEMPLATES = [
  { id: "exec_summary", label: "Executive Summary", icon: Star, description: "KPIs, headline risks, and top 3 recommendations" },
  { id: "headcount_plan", label: "Headcount Plan", icon: Users, description: "BU breakdown, scenario delta, timeline" },
  { id: "budget_review", label: "Budget Review", icon: BarChart3, description: "Budget vs. actuals, variance analysis" },
  { id: "ai_transformation", label: "AI Transformation", icon: Brain, description: "Human-AI ratio, automation roadmap, capacity gains" },
  { id: "attrition_risk", label: "Attrition Risk", icon: Shield, description: "High-risk cohorts, root causes, recommended actions" },
  { id: "skills_agenda", label: "Skills Agenda", icon: Layers, description: "Top gaps, buy/build/borrow strategy" },
  { id: "org_design", label: "Org Design Review", icon: TrendingUp, description: "Spans, layers, digital labor nodes" },
];

const SAVED_DECKS = [
  { id: "d1", name: "Q2 2026 HRBP Board Deck", slides: 12, audience: "Board", updatedAt: "2d ago", status: "ready" },
  { id: "d2", name: "Engineering Headcount Review — May", slides: 8, audience: "CHRO", updatedAt: "1w ago", status: "ready" },
  { id: "d3", name: "AI Transformation Initiative Kickoff", slides: 15, audience: "All Hands", updatedAt: "2w ago", status: "draft" },
];

const AUDIENCES = ["Board of Directors", "CHRO", "CFO", "CEO", "Department Heads", "All Hands", "Investors"];

export default function StakeholderPage() {
  const [selectedSlides, setSelectedSlides] = useState<string[]>(["exec_summary", "headcount_plan", "ai_transformation"]);
  const [audience, setAudience] = useState("CHRO");
  const [deckName, setDeckName] = useState("May 2026 Workforce Review");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const toggleSlide = (id: string) => {
    setSelectedSlides((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const generate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          Stakeholder Presentation Builder
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Build board-ready workforce decks from live SWOP data in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Builder */}
        <div className="lg:col-span-2 space-y-5">
          {/* Deck config */}
          <div className="rounded-xl border border-white/8 p-5 space-y-4" style={{ background: "var(--swop-card)" }}>
            <h3 className="text-sm font-semibold text-white">Deck Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1.5">Deck Name</label>
                <input value={deckName} onChange={(e) => setDeckName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50" />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1.5">Target Audience</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50">
                  {AUDIENCES.map((a) => <option key={a} value={a} className="bg-[#1A2235]">{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Slide selector */}
          <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Slide Templates</h3>
              <span className="text-xs text-[#94A3B8]">{selectedSlides.length} selected</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SLIDE_TEMPLATES.map((slide) => {
                const selected = selectedSlides.includes(slide.id);
                return (
                  <button
                    key={slide.id}
                    onClick={() => toggleSlide(slide.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border text-left transition-colors",
                      selected ? "border-[#2563EB]/40 bg-[#2563EB]/8" : "border-white/8 hover:border-white/16"
                    )}
                  >
                    <div className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5",
                      selected ? "bg-[#2563EB]" : "bg-white/5 border border-white/10")}>
                      {selected ? <Check className="w-3.5 h-3.5 text-white" /> : <slide.icon className="w-3 h-3 text-[#94A3B8]" />}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", selected ? "text-white" : "text-[#94A3B8]")}>{slide.label}</p>
                      <p className="text-[11px] text-[#94A3B8]/60">{slide.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate */}
          <AnimatePresence mode="wait">
            {!generated ? (
              <motion.button
                key="gen"
                onClick={generate}
                disabled={generating || selectedSlides.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Presentation className="w-4 h-4" />}
                {generating ? "Generating deck..." : `Generate ${selectedSlides.length}-Slide Deck`}
              </motion.button>
            ) : (
              <motion.div key="ready" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#10B981]/25 p-4 bg-[#10B981]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#34D399]" />
                    <span className="text-sm font-semibold text-white">Deck ready — {selectedSlides.length} slides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[#94A3B8] text-xs hover:text-white transition-colors">
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs hover:bg-[#1d4ed8] transition-colors">
                      <Download className="w-3 h-3" /> Download PPTX
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[#94A3B8] text-xs hover:text-white transition-colors">
                      <Share2 className="w-3 h-3" /> Share Link
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedSlides.map((id) => {
                    const t = SLIDE_TEMPLATES.find((s) => s.id === id);
                    return t ? (
                      <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399]">{t.label}</span>
                    ) : null;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Saved decks */}
        <div className="space-y-3">
          <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Saved Decks</p>
          {SAVED_DECKS.map((deck) => (
            <div key={deck.id} className="rounded-xl border border-white/8 p-4 hover:border-white/14 transition-colors"
              style={{ background: "var(--swop-card)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{deck.name}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{deck.audience} · {deck.slides} slides · {deck.updatedAt}</p>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border shrink-0",
                  deck.status === "ready" ? "border-[#10B981]/25 text-[#34D399] bg-[#10B981]/10" : "border-white/15 text-[#94A3B8]"
                )}>{deck.status}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-[11px] text-[#2563EB] hover:underline">View</button>
                <button className="text-[11px] text-[#94A3B8] hover:underline">Duplicate</button>
                <button className="text-[11px] text-[#94A3B8] hover:underline">Export</button>
              </div>
            </div>
          ))}

          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-white/12 text-xs text-[#94A3B8] hover:text-white hover:border-white/20 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New from Template
          </button>
        </div>
      </div>
    </div>
  );
}
