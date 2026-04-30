"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Plus, Trash2, Play, Download, Filter, GripVertical } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

const METRICS = [
  "Headcount by BU", "Headcount by Level", "Attrition Rate", "Time to Fill",
  "Budget vs. Actuals", "Span of Control", "Skills Gap %", "AI Risk Score",
  "Offer Acceptance Rate", "Internal Mobility Rate",
];

const FILTERS = [
  { label: "Business Unit", options: ["All", "Engineering", "Sales", "CS", "Marketing", "Operations", "Finance"] },
  { label: "Time Period", options: ["Last 3mo", "Last 6mo", "Last 12mo", "YTD", "Custom"] },
  { label: "Group By", options: ["BU", "Level", "Location", "Month", "Quarter"] },
];

const SAMPLE_DATA = [
  { name: "Engineering", value: 720 },
  { name: "Sales", value: 580 },
  { name: "CS", value: 370 },
  { name: "Operations", value: 340 },
  { name: "Marketing", value: 210 },
  { name: "Finance", value: 180 },
];

const SAVED_REPORTS = [
  { name: "Engineering HC by Level — Q2", metric: "Headcount by Level", created: "1d ago" },
  { name: "Attrition by BU — FY26 YTD", metric: "Attrition Rate", created: "3d ago" },
  { name: "Budget Variance by Function", metric: "Budget vs. Actuals", created: "1w ago" },
];

export default function ReportsPage() {
  const [selectedMetric, setSelectedMetric] = useState("Headcount by BU");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    "Business Unit": "All",
    "Time Period": "Last 12mo",
    "Group By": "BU",
  });
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 800));
    setRunning(false);
    setRan(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          Custom Report Builder
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Build ad-hoc workforce intelligence reports with any metric and filter combination
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Builder panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-3">Metric</p>
            <div className="space-y-1">
              {METRICS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedMetric(m); setRan(false); }}
                  className={cn(
                    "w-full text-left text-xs px-3 py-2 rounded-lg transition-colors",
                    selectedMetric === m
                      ? "bg-[#2563EB]/15 text-white border border-[#2563EB]/25"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Filters</p>
            {FILTERS.map((f) => (
              <div key={f.label}>
                <label className="block text-[10px] text-[#94A3B8] mb-1">{f.label}</label>
                <select
                  value={selectedFilters[f.label]}
                  onChange={(e) => setSelectedFilters((prev) => ({ ...prev, [f.label]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-[#2563EB]/50"
                >
                  {f.options.map((o) => <option key={o} value={o} className="bg-[#1A2235]">{o}</option>)}
                </select>
              </div>
            ))}
            <button
              onClick={run}
              disabled={running}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#2563EB] text-white text-xs font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              {running ? "Running..." : "Run Report"}
            </button>
          </div>
        </div>

        {/* Chart + results */}
        <div className="lg:col-span-3 space-y-4">
          {ran ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{selectedMetric}</h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {selectedFilters["Business Unit"]} · {selectedFilters["Time Period"]} · Grouped by {selectedFilters["Group By"]}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-[#60A5FA] hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> CSV</button>
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white transition-colors">Save Report</button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={SAMPLE_DATA} barCategoryGap="35%">
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11 }}
                      labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#60A5FA" }} />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} name={selectedMetric} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "var(--swop-card)" }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/6">
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Group</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Value</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_DATA.map((row) => (
                      <tr key={row.name} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-sm text-white">{row.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-right text-white">{row.value.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-mono text-right text-[#94A3B8]">{((row.value / 2400) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-white/8 p-16 flex flex-col items-center justify-center text-center" style={{ background: "var(--swop-card)" }}>
              <BarChart3 className="w-10 h-10 text-[#94A3B8]/25 mb-3" />
              <p className="text-sm text-[#94A3B8]">Select a metric and run your report</p>
            </div>
          )}

          {/* Saved reports */}
          <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
            <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-3">Saved Reports</p>
            <div className="space-y-2">
              {SAVED_REPORTS.map((r) => (
                <div key={r.name} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
                  <div>
                    <p className="text-sm text-white">{r.name}</p>
                    <p className="text-xs text-[#94A3B8]">{r.metric} · {r.created}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-[#60A5FA] hover:underline">Load</button>
                    <button className="text-xs text-[#94A3B8] hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
