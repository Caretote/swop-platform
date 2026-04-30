"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart as LineChartIcon, Search, Clock, Pin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CACHED = [
  { id: 1, query: "ML Engineer · San Francisco", summary: "Severe supply shortage: demand outpaces supply 1.8×. P50 $220K, P75 $260K, P90 $310K. Meta/Google/Anthropic all expanding. Expect 90-120 day TTF.", date: "2h ago", pinned: true },
  { id: 2, query: "Enterprise AE · New York", summary: "Moderate supply. Strong talent pool from Salesforce, HubSpot, Gartner churns. P50 $155K + $80K OTE. 45-60 day TTF realistic.", date: "1d ago", pinned: false },
  { id: 3, query: "Customer Success Manager · Remote", summary: "Highly competitive. 40% of CS talent now expects full remote. P50 $105K. Gainsight/Salesforce certification adds 15% salary premium.", date: "3d ago", pinned: true },
];

const JOB_FAMILIES = ["ML Engineer", "Software Engineer", "Enterprise AE", "SDR", "CSM", "Data Engineer", "Product Manager", "Data Scientist", "Revenue Operations", "Content Strategist"];
const LOCATIONS = ["San Francisco", "New York", "Seattle", "Austin", "Chicago", "Remote", "London", "Boston"];

export default function MarketIntelPage() {
  const [jobFamily, setJobFamily] = useState("ML Engineer");
  const [location, setLocation] = useState("San Francisco");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState(CACHED);

  const runQuery = async () => {
    setLoading(true);
    setResult("");
    try {
      const resp = await fetch("/api/ai/market-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobFamily, location, skill }),
      });
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text") setResult((prev) => prev + data.text);
            } catch {}
          }
        }
      }
    } catch {
      setResult("Error fetching market intelligence. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Labor Market Intelligence</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Real-time talent supply, salary benchmarks, and competitor hiring signals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Query builder */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 p-5 space-y-4" style={{ background: "var(--swop-card)" }}>
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Intelligence Query</h3>
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1.5">Job Family</label>
              <select value={jobFamily} onChange={(e) => setJobFamily(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50">
                {JOB_FAMILIES.map((j) => <option key={j} value={j} className="bg-[#1A2235]">{j}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1.5">Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50">
                {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1A2235]">{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1.5">Skill (optional)</label>
              <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g., PyTorch, Salesforce"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 placeholder:text-[#94A3B8]/40" />
            </div>
            <button onClick={runQuery} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Researching..." : "Run Intelligence Report"}
            </button>
          </div>

          {/* History */}
          <div className="space-y-2">
            <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Recent Queries</p>
            {history.map((h) => (
              <div key={h.id} className="rounded-xl border border-white/8 p-3 hover:border-white/12 transition-colors cursor-pointer" style={{ background: "var(--swop-card)" }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-white">{h.query}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {h.pinned && <Pin className="w-3 h-3 text-[#F59E0B]" />}
                    <span className="text-[10px] text-[#94A3B8]">{h.date}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2">{h.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="lg:col-span-2">
          {result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-white/8 p-6 h-full" style={{ background: "var(--swop-card)" }}>
              <div className="flex items-center gap-2 mb-4">
                <LineChartIcon className="w-4 h-4 text-[#60A5FA]" />
                <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
                  {jobFamily} · {location}
                </h3>
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#94A3B8]" />}
              </div>
              <div className="ai-prose text-sm whitespace-pre-wrap">{result}</div>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-white/8 p-12 flex flex-col items-center justify-center h-full text-center" style={{ background: "var(--swop-card)" }}>
              <LineChartIcon className="w-10 h-10 text-[#94A3B8]/30 mb-3" />
              <p className="text-sm text-[#94A3B8]">Select a job family and location, then run a query</p>
              <p className="text-xs text-[#94A3B8]/50 mt-1">Reports are cached for 7 days to minimize API costs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
