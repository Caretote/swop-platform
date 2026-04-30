"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle, TrendingUp, Users, Brain, AlertTriangle, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PAST_DOCS = [
  { name: "Q1 2026 Board Memo.pdf", type: "PDF", signals: 14, date: "2d ago", summary: "Board memo signals 25% growth target for Sales, AI transformation budget approved at $8M, Engineering headcount freeze lifted in Q2." },
  { name: "FY2026 Earnings Transcript.txt", type: "TXT", signals: 22, date: "1w ago", summary: "CEO committed to 'human+agent' ratio of 3:1 by end of FY2027. CFO flagged HC budget discipline — no headcount adds without AI offset plan." },
  { name: "HRBP Strategy Notes.docx", type: "DOCX", signals: 8, date: "2w ago", summary: "3 BUs flagged for retention risk. Succession gaps in VP Marketing and ML Engineering Manager. Change management capacity critically low." },
];

const SIGNAL_ICONS: Record<string, React.ComponentType<any>> = {
  growth_signals: TrendingUp,
  headcount_signals: Users,
  skills_signals: Brain,
  ai_transformation_signals: Brain,
  risk_signals: AlertTriangle,
};

const SIGNAL_COLORS: Record<string, string> = {
  growth_signals: "#10B981",
  headcount_signals: "#2563EB",
  skills_signals: "#8B5CF6",
  ai_transformation_signals: "#A78BFA",
  risk_signals: "#EF4444",
};

export default function IngestionPage() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = async (file?: File, text?: string) => {
    setLoading(true);
    setSignals(null);
    const form = new FormData();
    if (file) { form.append("file", file); setFileName(file.name); }
    if (text) { form.append("text", text); setFileName("text-input.txt"); }

    try {
      const resp = await fetch("/api/ai/ingest", { method: "POST", body: form });
      const data = await resp.json();
      setSignals(data.signals);
    } catch {
      setSignals({ summary: "Error processing document.", executive_priorities: [] });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const signalSections = signals ? Object.entries(signals).filter(([k]) => k !== "summary" && k !== "executive_priorities" && Array.isArray(signals[k])) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Document Ingestion</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Extract workforce planning signals from strategy docs, board memos, and earnings transcripts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !showTextInput && fileRef.current?.click()}
            className={cn(
              "rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all",
              dragging ? "border-[#2563EB]/60 bg-[#2563EB]/8" : "border-white/12 hover:border-white/20"
            )}
            style={{ background: dragging ? undefined : "var(--swop-card)" }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            <Upload className={cn("w-10 h-10 mb-3", dragging ? "text-[#60A5FA]" : "text-[#94A3B8]/40")} />
            <p className="text-sm font-medium text-white">Drop PDF, DOCX, or TXT</p>
            <p className="text-xs text-[#94A3B8] mt-1">or click to browse</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="h-px flex-1 bg-white/8 w-16" />
              <span className="text-xs text-[#94A3B8]/50">or</span>
              <div className="h-px flex-1 bg-white/8 w-16" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTextInput(!showTextInput); }}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#60A5FA] hover:underline"
            >
              <FileText className="w-3 h-3" /> Paste text directly
            </button>
          </div>

          {showTextInput && (
            <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: "var(--swop-card)" }}>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your document text here..."
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 resize-none placeholder:text-[#94A3B8]/40"
                rows={5}
              />
              <div className="flex gap-2">
                <button onClick={() => textInput && processFile(undefined, textInput)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1d4ed8] transition-colors">
                  <Brain className="w-3.5 h-3.5" /> Extract Signals
                </button>
                <button onClick={() => { setShowTextInput(false); setTextInput(""); }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/8 text-[#94A3B8] text-sm hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {loading && (
            <div className="rounded-xl border border-white/8 p-8 flex flex-col items-center gap-3" style={{ background: "var(--swop-card)" }}>
              <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
              <p className="text-sm text-[#94A3B8]">Extracting workforce signals from {fileName}...</p>
            </div>
          )}

          {signals && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="rounded-xl border border-[#10B981]/25 p-4 bg-[#10B981]/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#34D399]" />
                  <span className="text-sm font-semibold text-white">Signals Extracted from {fileName}</span>
                </div>
                <p className="text-sm text-[#94A3B8]">{signals.summary}</p>
              </div>

              {signals.executive_priorities?.length > 0 && (
                <div className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
                  <p className="text-xs text-[#94A3B8] font-semibold mb-2 uppercase tracking-wider">Executive Priorities</p>
                  <div className="flex flex-wrap gap-2">
                    {signals.executive_priorities.map((p: string) => (
                      <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/25">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {signalSections.map(([key, items]: [string, any]) => {
                const Icon = SIGNAL_ICONS[key] ?? FileText;
                const color = SIGNAL_COLORS[key] ?? "#94A3B8";
                const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div key={key} className="rounded-xl border border-white/8 p-4" style={{ background: "var(--swop-card)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4" style={{ color }} />
                      <span className="text-sm font-semibold text-white">{label}</span>
                      <span className="text-xs font-mono text-[#94A3B8]">({(items as any[]).length})</span>
                    </div>
                    <div className="space-y-2">
                      {(items as any[]).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                          <p className="text-[#94A3B8]">{item.signal ?? item.description ?? item.skill ?? JSON.stringify(item)}</p>
                          {(item.magnitude || item.severity) && (
                            <span className="text-[10px] font-mono ml-auto shrink-0" style={{ color }}>{item.magnitude ?? item.severity}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Document library */}
        <div className="space-y-3">
          <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Document Library</p>
          {PAST_DOCS.map((doc) => (
            <div key={doc.name} className="rounded-xl border border-white/8 p-4 hover:border-white/12 transition-colors" style={{ background: "var(--swop-card)" }}>
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-white">{doc.name}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{doc.date} · {doc.signals} signals</p>
                </div>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">{doc.summary}</p>
              <button className="mt-2 text-[11px] text-[#2563EB] hover:underline">View Signals</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
