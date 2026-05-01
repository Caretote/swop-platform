"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight, ChevronLeft, Sparkles, FileText, Target, BarChart3, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Plan Config", icon: FileText },
  { label: "Baseline", icon: BarChart3 },
  { label: "Assumptions", icon: Target },
  { label: "Review & Launch", icon: Sparkles },
];

const BU_OPTIONS = ["Sales", "Engineering", "Marketing", "Operations", "Finance", "Customer Success"];

export default function NewPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    type: "",
    fiscalYear: "FY2026",
    businessUnits: [] as string[],
    revenueGrowth: "15",
    attrition: "8",
    aiOffset: "5",
    hiringLeadTime: "90",
  });
  const [generating, setGenerating] = useState(false);
  const [narrative, setNarrative] = useState("");

  const toggleBU = (bu: string) => {
    setForm((f) => ({
      ...f,
      businessUnits: f.businessUnits.includes(bu)
        ? f.businessUnits.filter((b) => b !== bu)
        : [...f.businessUnits, bu],
    }));
  };

  const generateNarrative = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setNarrative(`**FY2026 Workforce Plan — Executive Summary**\n\nMJ Corp's ${form.name || "FY2026 Workforce Plan"} targets ${form.revenueGrowth}% revenue growth with a net headcount increase of ~60 FTEs across ${form.businessUnits.length || 5} business units. Key assumptions include an ${form.attrition}% attrition rate and ${form.aiOffset}% AI/automation offset — primarily in Sales SDR and CS support tiers. The plan carries moderate execution risk given current Engineering hiring velocity (82-day avg TTF vs. 45-day assumption). Recommend phasing Q1 Engineering hires into Q2 to de-risk.`);
    setGenerating(false);
  };

  const canAdvance = () => {
    if (step === 0) return form.name && form.type && form.fiscalYear && form.businessUnits.length > 0;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>New Workforce Plan</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Configure and launch a new strategic workforce plan</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className="flex items-center gap-2 flex-1 min-w-0">
              <div className={cn(
                "flex items-center gap-2 min-w-0",
                i < STEPS.length - 1 && "flex-1"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-all",
                  done ? "bg-[#10B981] text-white" : active ? "bg-[#2563EB] text-white" : "bg-white/8 text-[#94A3B8]"
                )}>
                  {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={cn("text-xs hidden sm:block truncate", active ? "text-white font-medium" : done ? "text-[#34D399]" : "text-[#94A3B8]")}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-px flex-1 mx-2", done ? "bg-[#10B981]/40" : "bg-white/10")} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-white/8 p-6 space-y-5"
          style={{ background: "var(--swop-card)" }}
        >
          {step === 0 && (
            <>
              <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Plan Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Plan Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., FY2026 Annual Workforce Plan"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 transition-colors placeholder:text-[#94A3B8]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Plan Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "THREE_YEAR_STRATEGIC", label: "3-Year Strategic" },
                      { value: "ANNUAL", label: "Annual" },
                      { value: "QUARTERLY", label: "Quarterly" },
                      { value: "AI_TRANSFORMATION", label: "AI Transformation" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setForm({ ...form, type: t.value })}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm border transition-all text-left",
                          form.type === t.value ? "bg-[#2563EB]/15 border-[#2563EB]/40 text-white" : "border-white/8 text-[#94A3B8] hover:border-white/15 hover:text-white"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Fiscal Year</label>
                  <div className="flex gap-2">
                    {["FY2026", "FY2027", "FY2028"].map((y) => (
                      <button
                        key={y}
                        onClick={() => setForm({ ...form, fiscalYear: y })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm border transition-all",
                          form.fiscalYear === y ? "bg-[#2563EB]/15 border-[#2563EB]/40 text-white" : "border-white/8 text-[#94A3B8] hover:border-white/15"
                        )}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Business Units</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BU_OPTIONS.map((bu) => (
                      <button
                        key={bu}
                        onClick={() => toggleBU(bu)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs border transition-all flex items-center gap-1.5",
                          form.businessUnits.includes(bu) ? "bg-[#2563EB]/15 border-[#2563EB]/40 text-white" : "border-white/8 text-[#94A3B8] hover:border-white/15"
                        )}
                      >
                        {form.businessUnits.includes(bu) && <Check className="w-3 h-3 text-[#60A5FA]" />}
                        {bu}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Baseline Snapshot</h2>
              <div className="rounded-lg border border-white/8 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/6">
                      <th className="text-left px-4 py-2.5 text-xs text-[#94A3B8]">Business Unit</th>
                      <th className="text-right px-4 py-2.5 text-xs text-[#94A3B8]">Current HC</th>
                      <th className="text-right px-4 py-2.5 text-xs text-[#94A3B8]">Open Reqs</th>
                      <th className="text-right px-4 py-2.5 text-xs text-[#94A3B8]">Attrition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { bu: "Sales", hc: 580, open: 24, attr: "8.2%" },
                      { bu: "Engineering", hc: 720, open: 32, attr: "9.1%" },
                      { bu: "Marketing", hc: 210, open: 8, attr: "7.5%" },
                      { bu: "Operations", hc: 340, open: 11, attr: "6.8%" },
                      { bu: "Finance", hc: 180, open: 5, attr: "5.9%" },
                      { bu: "Customer Success", hc: 370, open: 18, attr: "10.4%" },
                    ].map((row) => (
                      <tr key={row.bu} className="border-b border-white/4 last:border-0">
                        <td className="px-4 py-2.5 text-sm text-white">{row.bu}</td>
                        <td className="px-4 py-2.5 text-right text-sm font-mono text-[#94A3B8]">{row.hc.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-sm font-mono text-[#94A3B8]">{row.open}</td>
                        <td className="px-4 py-2.5 text-right text-sm font-mono text-[#94A3B8]">{row.attr}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/3">
                      <td className="px-4 py-2.5 text-sm font-semibold text-white">Total</td>
                      <td className="px-4 py-2.5 text-right text-sm font-mono font-semibold text-white">2,400</td>
                      <td className="px-4 py-2.5 text-right text-sm font-mono font-semibold text-white">98</td>
                      <td className="px-4 py-2.5 text-right text-sm font-mono font-semibold text-white">8.4%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-xs text-[#94A3B8]">Auto-populated from MJ Corp HRIS. Last sync: 2h ago.</p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Growth & Assumptions</h2>
              <div className="space-y-4">
                {[
                  { label: "Revenue Growth Target", key: "revenueGrowth", suffix: "%", hint: "Target revenue growth rate" },
                  { label: "Attrition Assumption", key: "attrition", suffix: "%", hint: "Expected annual turnover" },
                  { label: "AI/Automation Offset", key: "aiOffset", suffix: "%", hint: "Roles offset by AI agents" },
                  { label: "Hiring Lead Time", key: "hiringLeadTime", suffix: " days", hint: "Average days to fill a role" },
                ].map((field) => (
                  <div key={field.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-[#94A3B8]">{field.label}</label>
                      <span className="text-xs text-[#94A3B8]/60">{field.hint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]/50 font-mono"
                      />
                      <span className="text-sm text-[#94A3B8] w-10">{field.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Review & Launch</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Net New HC", value: "+62", color: "#10B981" },
                    { label: "Budget Impact", value: "+$11.2M", color: "#F59E0B" },
                    { label: "Risk Level", value: "Medium", color: "#2563EB" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-white/8 p-3 text-center">
                      <div className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-white/8 p-4 space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">Plan Name</span><span className="text-white font-medium">{form.name || "—"}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">Type</span><span className="text-white">{form.type || "—"}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">Revenue Growth</span><span className="text-white font-mono">{form.revenueGrowth}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">Attrition Assumption</span><span className="text-white font-mono">{form.attrition}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">AI Offset</span><span className="text-white font-mono">{form.aiOffset}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">Business Units</span><span className="text-white">{form.businessUnits.join(", ") || "—"}</span></div>
                </div>

                <div>
                  <button
                    onClick={generateNarrative}
                    disabled={generating}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 hover:bg-[#8B5CF6]/20 transition-colors text-sm text-[#A78BFA] disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {generating ? "Generating narrative..." : "Generate AI Executive Summary"}
                  </button>
                  {narrative && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-4 rounded-lg border border-[#8B5CF6]/20 bg-[#8B5CF6]/5"
                    >
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{narrative}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.push("/workforce-plans")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white hover:border-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? "Cancel" : "Back"}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/workforce-plans")}
              className="px-4 py-2 rounded-lg border border-white/10 text-[#94A3B8] text-sm hover:text-white transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={() => router.push("/workforce-plans")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Launch Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
