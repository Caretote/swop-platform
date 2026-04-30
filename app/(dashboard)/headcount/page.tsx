"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Download, Plus, ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

const HEADCOUNT_DATA = [
  { bu: "Sales", jobFamily: "Enterprise Sales", currentHC: 320, q1: 330, q2: 345, q3: 360, q4: 375, target: 380, budget: 58_500_000, status: "on-track" },
  { bu: "Sales", jobFamily: "Sales Development", currentHC: 142, q1: 148, q2: 155, q3: 160, q4: 165, target: 170, budget: 10_400_000, status: "at-risk" },
  { bu: "Sales", jobFamily: "Sales Engineering", currentHC: 68, q1: 72, q2: 76, q3: 80, q4: 82, target: 85, budget: 9_300_000, status: "on-track" },
  { bu: "Sales", jobFamily: "Revenue Operations", currentHC: 50, q1: 52, q2: 54, q3: 56, q4: 58, target: 60, budget: 5_200_000, status: "on-track" },
  { bu: "Engineering", jobFamily: "Software Engineering", currentHC: 480, q1: 498, q2: 515, q3: 530, q4: 545, target: 550, budget: 95_000_000, status: "at-risk" },
  { bu: "Engineering", jobFamily: "AI/ML", currentHC: 88, q1: 95, q2: 105, q3: 115, q4: 125, target: 130, budget: 22_000_000, status: "behind" },
  { bu: "Engineering", jobFamily: "Data", currentHC: 92, q1: 96, q2: 100, q3: 104, q4: 108, target: 110, budget: 16_500_000, status: "on-track" },
  { bu: "Engineering", jobFamily: "Product", currentHC: 60, q1: 62, q2: 64, q3: 66, q4: 68, target: 70, budget: 11_000_000, status: "on-track" },
  { bu: "Marketing", jobFamily: "Demand Generation", currentHC: 55, q1: 57, q2: 59, q3: 61, q4: 63, target: 65, budget: 8_500_000, status: "on-track" },
  { bu: "Marketing", jobFamily: "Content", currentHC: 42, q1: 44, q2: 46, q3: 48, q4: 50, target: 50, budget: 5_200_000, status: "on-track" },
  { bu: "Operations", jobFamily: "Operations", currentHC: 210, q1: 214, q2: 218, q3: 222, q4: 226, target: 228, budget: 22_000_000, status: "on-track" },
  { bu: "Finance", jobFamily: "FP&A", currentHC: 95, q1: 97, q2: 99, q3: 101, q4: 103, target: 105, budget: 11_500_000, status: "on-track" },
  { bu: "Customer Success", jobFamily: "Customer Success", currentHC: 242, q1: 252, q2: 262, q3: 272, q4: 282, target: 285, budget: 29_000_000, status: "on-track" },
  { bu: "Customer Success", jobFamily: "Technical Support", currentHC: 128, q1: 130, q2: 132, q3: 134, q4: 136, target: 138, budget: 11_000_000, status: "at-risk" },
];

const STATUS_COLORS: Record<string, string> = {
  "on-track": "text-[#34D399]",
  "at-risk": "text-[#FCD34D]",
  "behind": "text-[#F87171]",
};

const STATUS_DOTS: Record<string, string> = {
  "on-track": "bg-[#10B981]",
  "at-risk": "bg-[#F59E0B]",
  "behind": "bg-[#EF4444]",
};

export default function HeadcountPage() {
  const [filterBU, setFilterBU] = useState("All");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const BUs = ["All", ...Array.from(new Set(HEADCOUNT_DATA.map((r) => r.bu)))];

  const filtered = HEADCOUNT_DATA.filter((r) => filterBU === "All" || r.bu === filterBU);
  const totals = filtered.reduce((acc, r) => ({
    currentHC: acc.currentHC + r.currentHC,
    target: acc.target + r.target,
    budget: acc.budget + r.budget,
  }), { currentHC: 0, target: 0, budget: 0 });

  const sort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: string }) => (
    sortField === field
      ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)
      : <ChevronDown className="w-3 h-3 opacity-30" />
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Headcount Planning</h1>
          <p className="text-sm text-[#94A3B8] mt-1">FY2026 · All Business Units · Quarterly targets</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/headcount/scenarios">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white hover:border-white/20 transition-colors">
              <TrendingUp className="w-4 h-4" /> Scenarios
            </button>
          </Link>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1d4ed8] transition-colors">
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Current HC", value: totals.currentHC.toLocaleString(), color: "#60A5FA" },
          { label: "EOY Target", value: totals.target.toLocaleString(), color: "#34D399" },
          { label: "Net Add", value: `+${(totals.target - totals.currentHC).toLocaleString()}`, color: "#F59E0B" },
          { label: "HC Budget", value: `$${(totals.budget / 1_000_000).toFixed(1)}M`, color: "#A78BFA" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8]">{s.label}</p>
            <p className="text-xl font-bold font-mono mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#94A3B8]" />
        {BUs.map((bu) => (
          <button
            key={bu}
            onClick={() => setFilterBU(bu)}
            className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${filterBU === bu ? "bg-[#2563EB]/15 border-[#2563EB]/40 text-white" : "border-white/8 text-[#94A3B8] hover:border-white/15"}`}
          >
            {bu}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-[#94A3B8] text-xs hover:text-white transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/8 overflow-auto" style={{ background: "var(--swop-card)" }}>
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/8">
              {[
                { label: "BU", field: "bu" },
                { label: "Job Family", field: "jobFamily" },
                { label: "Current", field: "currentHC" },
                { label: "Q1 Plan", field: "q1" },
                { label: "Q2 Plan", field: "q2" },
                { label: "Q3 Plan", field: "q3" },
                { label: "Q4 Plan", field: "q4" },
                { label: "EOY Target", field: "target" },
                { label: "Δ vs Plan", field: null },
                { label: "Budget", field: "budget" },
                { label: "Status", field: "status" },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={() => col.field && sort(col.field)}
                  className={`px-4 py-3 text-left text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider ${col.field ? "cursor-pointer hover:text-white transition-colors" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const delta = row.target - row.currentHC;
              return (
                <motion.tr
                  key={`${row.bu}-${row.jobFamily}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-[#94A3B8]">{row.bu}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{row.jobFamily}</td>
                  <td className="px-4 py-3 text-sm font-mono text-white">{row.currentHC.toLocaleString()}</td>
                  {[row.q1, row.q2, row.q3, row.q4].map((v, qi) => (
                    <td key={qi} className="px-4 py-3 text-sm font-mono text-[#94A3B8]">{v.toLocaleString()}</td>
                  ))}
                  <td className="px-4 py-3 text-sm font-mono text-white font-semibold">{row.target.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs font-mono ${delta > 0 ? "text-[#34D399]" : "text-[#F87171]"}`}>
                      {delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {delta > 0 ? "+" : ""}{delta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-[#94A3B8]">${(row.budget / 1_000_000).toFixed(1)}M</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 text-xs ${STATUS_COLORS[row.status]}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[row.status]}`} />
                      {row.status.replace("-", " ")}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/8 bg-white/3">
              <td colSpan={2} className="px-4 py-3 text-xs font-semibold text-white">Totals ({filtered.length} rows)</td>
              <td className="px-4 py-3 text-sm font-mono font-bold text-white">{totals.currentHC.toLocaleString()}</td>
              <td colSpan={4} className="px-4 py-3" />
              <td className="px-4 py-3 text-sm font-mono font-bold text-white">{totals.target.toLocaleString()}</td>
              <td className="px-4 py-3 text-xs font-mono font-bold text-[#34D399]">+{(totals.target - totals.currentHC).toLocaleString()}</td>
              <td className="px-4 py-3 text-sm font-mono font-bold text-white">${(totals.budget / 1_000_000).toFixed(1)}M</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
