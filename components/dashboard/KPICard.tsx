"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  accentColor?: "blue" | "teal" | "amber" | "green" | "red" | "purple";
  sparkline?: number[];
  index?: number;
}

const ACCENT = {
  blue:   { bg: "rgba(37,99,235,0.1)",   border: "rgba(37,99,235,0.2)",   text: "#60A5FA", glow: "var(--swop-glow)" },
  teal:   { bg: "rgba(14,165,233,0.1)",  border: "rgba(14,165,233,0.2)",  text: "#38BDF8", glow: "0 0 30px rgba(14,165,233,0.15)" },
  amber:  { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)",  text: "#FCD34D", glow: "0 0 30px rgba(245,158,11,0.15)" },
  green:  { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)",  text: "#34D399", glow: "0 0 30px rgba(16,185,129,0.15)" },
  red:    { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)",   text: "#F87171", glow: "0 0 30px rgba(239,68,68,0.15)" },
  purple: { bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.2)",  text: "#A78BFA", glow: "var(--swop-ai-glow)" },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

export function KPICard({ title, value, change, changeLabel, prefix, suffix, decimals = 0, icon, accentColor = "blue", sparkline, index = 0 }: Props) {
  const accent = ACCENT[accentColor];
  const isPositive = (change ?? 0) > 0;
  const isNeutral = !change || change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 25 }}
      className="relative rounded-xl border p-4 overflow-hidden"
      style={{
        background: "var(--swop-card)",
        borderColor: accent.border,
        boxShadow: accent.glow,
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse at top right, ${accent.bg}, transparent 70%)` }} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">{title}</span>
          {icon && (
            <div className="p-1.5 rounded-lg" style={{ background: accent.bg }}>
              <div style={{ color: accent.text }}>{icon}</div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" }}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
            </div>
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 mt-1 text-xs",
                isNeutral ? "text-[#94A3B8]" : isPositive ? "text-[#34D399]" : "text-[#F87171]"
              )}>
                {isNeutral ? <Minus className="w-3 h-3" /> : isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {!isNeutral && `${isPositive ? "+" : ""}${change}%`}
                {changeLabel && <span className="text-[#94A3B8] ml-1">{changeLabel}</span>}
              </div>
            )}
          </div>
          {sparkline && <MiniSparkline data={sparkline} color={accent.text} />}
        </div>
      </div>
    </motion.div>
  );
}
