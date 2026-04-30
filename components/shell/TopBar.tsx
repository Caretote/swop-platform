"use client";

import { useState } from "react";
import { Search, Bell, Bot, ChevronDown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface TopBarProps {
  onOpenCopilot?: () => void;
  onOpenCommandPalette?: () => void;
}

export function TopBar({ onOpenCopilot, onOpenCommandPalette }: TopBarProps) {
  const [notifications] = useState(3);

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0"
      style={{ background: "var(--swop-surface)" }}
    >
      {/* Search */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 bg-white/4 hover:bg-white/6 hover:border-white/12 transition-all text-[#94A3B8] text-sm min-w-[240px]"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">Search or run command...</span>
        <kbd className="text-[10px] font-mono bg-white/8 px-1.5 py-0.5 rounded text-[#94A3B8]">⌘K</kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* AI status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] agent-active" />
          <span className="text-[11px] text-[#A78BFA]">7 Agents Active</span>
        </div>

        {/* AI Co-Pilot button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/25 hover:bg-[#2563EB]/20 transition-colors text-sm text-[#60A5FA]"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="text-xs">SWOP Copilot</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4 text-[#94A3B8]" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-[11px] font-bold text-white">AC</div>
          <span className="text-sm text-[#94A3B8]">Alex Chen</span>
          <ChevronDown className="w-3 h-3 text-[#94A3B8]/50" />
        </button>
      </div>
    </header>
  );
}
