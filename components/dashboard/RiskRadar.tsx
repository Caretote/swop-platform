"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const DATA = [
  { axis: "Retention Risk", score: 72 },
  { axis: "Skills Gap", score: 68 },
  { axis: "Budget Risk", score: 44 },
  { axis: "Succession Depth", score: 55 },
  { axis: "AI Readiness", score: 41 },
  { axis: "Diversity Gap", score: 38 },
];

export function RiskRadar() {
  return (
    <div className="rounded-xl border border-white/8 p-5 h-full" style={{ background: "var(--swop-card)" }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Organizational Risk Radar</h3>
        <p className="text-xs text-[#94A3B8]">Higher score = higher risk exposure</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#94A3B8", fontSize: 10 }} />
          <Radar
            name="Risk"
            dataKey="score"
            stroke="#EF4444"
            strokeWidth={2}
            fill="#EF4444"
            fillOpacity={0.12}
            dot={{ fill: "#EF4444", r: 3 }}
          />
          <Tooltip
            contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
            labelStyle={{ color: "#F1F5F9", fontSize: 12 }}
            itemStyle={{ color: "#94A3B8", fontSize: 12 }}
            formatter={(v: unknown) => [`${v}/100`, "Risk Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-1.5 mt-3">
        {DATA.sort((a, b) => b.score - a.score).slice(0, 4).map((d) => (
          <div key={d.axis} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/3">
            <span className="text-[11px] text-[#94A3B8] truncate">{d.axis}</span>
            <span className={`text-[11px] font-mono font-semibold ml-2 ${d.score > 65 ? "text-[#F87171]" : d.score > 50 ? "text-[#FCD34D]" : "text-[#34D399]"}`}>
              {d.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
