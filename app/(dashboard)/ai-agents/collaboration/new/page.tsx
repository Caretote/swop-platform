"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Building2, Users, ArrowRight, ArrowLeft, Loader2,
  CheckCircle, Sparkles, Layers, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

const FUNCTIONS = [
  "Sales Operations", "FP&A", "Customer Success", "Content Marketing",
  "Software Engineering", "Data Engineering", "HR Business Partnering",
  "Revenue Operations", "Legal Operations", "Procurement", "IT Operations",
];

const BUS = ["Sales", "Engineering", "Marketing", "Finance", "Customer Success", "Operations", "HR", "Legal"];

const SCOPE_OPTIONS = [
  { id: "full", label: "Full Function", description: "All tasks, roles, and sub-teams", icon: Layers },
  { id: "team", label: "Team / Pod", description: "Specific team within the function", icon: Users },
  { id: "process", label: "Process Area", description: "Single workflow or process", icon: ClipboardList },
];

const STAGES = [
  { id: "discovery", label: "Workflow Mapping", duration: "~25s" },
  { id: "augmentation", label: "Task Augmentation Analysis", duration: "~30s" },
  { id: "roi", label: "Productivity ROI Calculation", duration: "~20s" },
  { id: "anti_patterns", label: "Anti-Pattern Audit", duration: "~15s" },
];

export default function NewCollaborationPage() {
  const router = useRouter();
  const [step, setStep] = useState<"config" | "running" | "done">("config");
  const [functionName, setFunctionName] = useState("Sales Operations");
  const [businessUnit, setBusinessUnit] = useState("Sales");
  const [scope, setScope] = useState("full");
  const [customFunction, setCustomFunction] = useState("");

  const [stageStates, setStageStates] = useState<Record<string, "pending" | "running" | "done">>({
    discovery: "pending", augmentation: "pending", roi: "pending", anti_patterns: "pending",
  });
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const run = async () => {
    setStep("running");
    const fn = customFunction || functionName;

    const updateStage = (id: string, state: "running" | "done") => {
      setStageStates((prev) => ({ ...prev, [id]: state }));
    };

    try {
      const resp = await fetch("/api/ai/collaboration/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ functionName: fn, businessUnit, scope }),
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
          if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.stage === "progress") {
              setProgress(data.message ?? "");
              if (data.message?.includes("Stage 1")) updateStage("discovery", "running");
              if (data.message?.includes("Stage 2")) { updateStage("discovery", "done"); updateStage("augmentation", "running"); }
              if (data.message?.includes("Stage 3")) { updateStage("augmentation", "done"); updateStage("roi", "running"); updateStage("anti_patterns", "running"); }
            }
            if (data.stage === "complete") {
              updateStage("roi", "done");
              updateStage("anti_patterns", "done");
              setStep("done");
              setTimeout(() => router.push(`/ai-agents/collaboration/${data.analysisId}`), 1000);
            }
            if (data.stage === "error") {
              setError(data.message);
              setStep("config");
            }
          } catch {}
        }
      }
    } catch (e: any) {
      setError(e.message);
      setStep("config");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>
          New Collaboration Analysis
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Configure the 7-stage Human-AI Collaboration pipeline
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "config" && (
          <motion.div key="config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-[#EF4444]/25 p-3 bg-[#EF4444]/5 text-sm text-[#F87171]">{error}</div>
            )}

            {/* Function selector */}
            <div className="rounded-xl border border-white/8 p-5 space-y-4" style={{ background: "var(--swop-card)" }}>
              <h3 className="text-sm font-semibold text-white">Function to Analyze</h3>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1.5">Select Function</label>
                <select
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#8B5CF6]/50"
                >
                  {FUNCTIONS.map((f) => <option key={f} value={f} className="bg-[#1A2235]">{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1.5">Or describe a custom function</label>
                <input
                  value={customFunction}
                  onChange={(e) => setCustomFunction(e.target.value)}
                  placeholder="e.g., Demand Generation, Partner Enablement..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#8B5CF6]/50 placeholder:text-[#94A3B8]/40"
                />
              </div>
            </div>

            {/* Business unit */}
            <div className="rounded-xl border border-white/8 p-5 space-y-4" style={{ background: "var(--swop-card)" }}>
              <h3 className="text-sm font-semibold text-white">Business Unit</h3>
              <div className="grid grid-cols-4 gap-2">
                {BUS.map((bu) => (
                  <button
                    key={bu}
                    onClick={() => setBusinessUnit(bu)}
                    className={cn(
                      "py-2 rounded-lg border text-xs font-medium transition-colors",
                      businessUnit === bu
                        ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/15 text-[#A78BFA]"
                        : "border-white/8 text-[#94A3B8] hover:text-white hover:border-white/16"
                    )}
                  >
                    {bu}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope */}
            <div className="rounded-xl border border-white/8 p-5 space-y-4" style={{ background: "var(--swop-card)" }}>
              <h3 className="text-sm font-semibold text-white">Analysis Scope</h3>
              <div className="space-y-2">
                {SCOPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setScope(opt.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                      scope === opt.id
                        ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/10"
                        : "border-white/8 hover:border-white/16"
                    )}
                  >
                    <opt.icon className={cn("w-4 h-4 shrink-0", scope === opt.id ? "text-[#A78BFA]" : "text-[#94A3B8]")} />
                    <div>
                      <p className={cn("text-sm font-medium", scope === opt.id ? "text-white" : "text-[#94A3B8]")}>{opt.label}</p>
                      <p className="text-xs text-[#94A3B8]">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline preview */}
            <div className="rounded-xl border border-[#8B5CF6]/20 p-4 bg-[#8B5CF6]/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                <span className="text-sm font-semibold text-white">7-Stage AI Pipeline</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {STAGES.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <span className="text-xs text-[#94A3B8]">{s.label}</span>
                    <span className="text-[10px] text-[#94A3B8]/50 font-mono">{s.duration}</span>
                    {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-[#94A3B8]/30" />}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={run}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium transition-colors"
            >
              <Brain className="w-4 h-4" />
              Launch Analysis Pipeline
            </button>
          </motion.div>
        )}

        {step === "running" && (
          <motion.div key="running" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="rounded-xl border border-[#8B5CF6]/25 p-6" style={{ background: "var(--swop-card)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] agent-active" />
                <span className="text-sm text-[#A78BFA]">Pipeline running for {customFunction || functionName}...</span>
              </div>
              <div className="space-y-3">
                {STAGES.map((s) => {
                  const state = stageStates[s.id];
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                        state === "done" ? "bg-[#10B981]/20" : state === "running" ? "bg-[#8B5CF6]/20" : "bg-white/5"
                      )}>
                        {state === "done" ? <CheckCircle className="w-3.5 h-3.5 text-[#34D399]" /> :
                          state === "running" ? <Loader2 className="w-3.5 h-3.5 text-[#A78BFA] animate-spin" /> :
                            <div className="w-2 h-2 rounded-full bg-white/20" />}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm", state === "done" ? "text-[#34D399]" : state === "running" ? "text-white" : "text-[#94A3B8]/50")}>
                          {s.label}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#94A3B8]/50">{s.duration}</span>
                    </div>
                  );
                })}
              </div>
              {progress && (
                <p className="mt-4 text-xs text-[#94A3B8] italic">{progress}</p>
              )}
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-[#10B981]/25 p-8 text-center" style={{ background: "var(--swop-card)" }}>
            <CheckCircle className="w-12 h-12 text-[#34D399] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Blueprint Ready</h3>
            <p className="text-sm text-[#94A3B8]">Redirecting to your blueprint...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
