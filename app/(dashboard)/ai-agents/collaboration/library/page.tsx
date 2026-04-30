"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Search, Download, Copy, Star, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LIBRARY = [
  { id: "bp_sales_ops_01", function: "Sales Operations", bu: "Sales", roi: "+34%", tasks: 12, status: "complete", starred: true, createdAt: "2d ago" },
  { id: "bp_finance_fpa_01", function: "FP&A", bu: "Finance", roi: "+41%", tasks: 9, status: "complete", starred: true, createdAt: "5d ago" },
  { id: "bp_cs_support_01", function: "Customer Success", bu: "CS", roi: "+28%", tasks: 7, status: "in_progress", starred: false, createdAt: "1w ago" },
  { id: "bp_mkt_content_01", function: "Content Marketing", bu: "Marketing", roi: "+22%", tasks: 6, status: "draft", starred: false, createdAt: "2w ago" },
];

const STATUS_STYLE = {
  complete: { label: "Complete", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  in_progress: { label: "In Progress", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  draft: { label: "Draft", color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = LIBRARY.filter((b) => {
    const matchSearch = b.function.toLowerCase().includes(search.toLowerCase()) || b.bu.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          Blueprint Library
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">All saved Human-AI Collaboration blueprints</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blueprints..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#8B5CF6]/50 placeholder:text-[#94A3B8]/40" />
        </div>
        <div className="flex gap-2">
          {["all", "complete", "in_progress", "draft"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                filterStatus === s ? "bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30" : "border border-white/8 text-[#94A3B8] hover:text-white"
              )}>
              {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((bp, i) => {
          const sc = STATUS_STYLE[bp.status as keyof typeof STATUS_STYLE];
          return (
            <motion.div key={bp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="rounded-xl border border-white/8 p-5 hover:border-[#8B5CF6]/30 transition-all group"
                style={{ background: "var(--swop-card)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#A78BFA]" />
                    <div>
                      <p className="text-sm font-semibold text-white">{bp.function}</p>
                      <p className="text-xs text-[#94A3B8]">{bp.bu} · {bp.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {bp.starred && <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />}
                    <span className="text-[10px] px-2 py-0.5 rounded-full border"
                      style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}>{sc.label}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-white/3 p-2.5 text-center">
                    <p className="text-[10px] text-[#94A3B8]">ROI</p>
                    <p className="text-sm font-bold font-mono text-[#10B981]">{bp.roi}</p>
                  </div>
                  <div className="rounded-lg bg-white/3 p-2.5 text-center">
                    <p className="text-[10px] text-[#94A3B8]">Tasks Aug.</p>
                    <p className="text-sm font-bold font-mono text-[#F59E0B]">{bp.tasks}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/ai-agents/collaboration/${bp.id}`} className="flex-1">
                    <button className="w-full py-1.5 rounded-lg border border-[#8B5CF6]/25 text-[#A78BFA] text-xs hover:bg-[#8B5CF6]/10 transition-colors">
                      Open Blueprint
                    </button>
                  </Link>
                  <button className="p-1.5 rounded-lg border border-white/8 text-[#94A3B8] hover:text-white transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-white/8 text-[#94A3B8] hover:text-white transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
