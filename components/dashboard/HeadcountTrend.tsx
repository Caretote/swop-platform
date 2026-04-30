"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

const DATA = [
  { period: "Q1'25", actual: 2158, plan: 2150, forecast: null },
  { period: "Q2'25", actual: 2221, plan: 2200, forecast: null },
  { period: "Q3'25", actual: 2282, plan: 2270, forecast: null },
  { period: "Q4'25", actual: 2338, plan: 2320, forecast: null },
  { period: "Q1'26", actual: 2400, plan: 2380, forecast: 2400 },
  { period: "Q2'26", actual: null, plan: 2461, forecast: 2458 },
  { period: "Q3'26", actual: null, plan: 2530, forecast: 2520 },
  { period: "Q4'26", actual: null, plan: 2600, forecast: 2585 },
];

const BU_COLORS: Record<string, string> = {
  Sales: "#2563EB",
  Engineering: "#0EA5E9",
  Marketing: "#8B5CF6",
  Operations: "#F59E0B",
  Finance: "#10B981",
  "Customer Success": "#F97316",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 p-3 shadow-xl" style={{ background: "#1A2235" }}>
      <p className="text-xs text-[#94A3B8] mb-2 font-semibold">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[#94A3B8] capitalize">{entry.dataKey}:</span>
          <span className="text-white font-mono">{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function HeadcountTrend() {
  const [view, setView] = useState<"all" | "trend">("trend");

  return (
    <div className="rounded-xl border border-white/8 p-5 h-full" style={{ background: "var(--swop-card)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Headcount Trend</h3>
          <p className="text-xs text-[#94A3B8]">Actual vs. Plan vs. Forecast</p>
        </div>
        <div className="flex gap-1">
          {(["trend", "all"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs transition-all",
                view === v ? "bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30" : "text-[#94A3B8] hover:text-white"
              )}
            >
              {v === "trend" ? "Trend" : "By BU"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="period" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="plan" stroke="#94A3B8" strokeWidth={1} strokeDasharray="4 4" fill="url(#planGrad)" dot={false} name="Plan" />
          <Area type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2} fill="url(#actualGrad)" dot={false} name="Actual" connectNulls={false} />
          <Area type="monotone" dataKey="forecast" stroke="#0EA5E9" strokeWidth={2} strokeDasharray="5 3" fill="url(#forecastGrad)" dot={false} name="Forecast" connectNulls />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3">
        {[
          { label: "Actual", color: "#2563EB", dash: false },
          { label: "Plan", color: "#94A3B8", dash: true },
          { label: "Forecast", color: "#0EA5E9", dash: true },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <svg width="20" height="8">
              <line x1="0" y1="4" x2="20" y2="4" stroke={l.color} strokeWidth="2" strokeDasharray={l.dash ? "4 3" : undefined} />
            </svg>
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
