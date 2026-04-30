"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutDashboard, FileText, Users, Brain, Bot, BarChart3, Zap, ArrowRight } from "lucide-react";

const COMMANDS = [
  { label: "Command Center", href: "/", icon: LayoutDashboard, group: "Navigate" },
  { label: "Workforce Plans", href: "/workforce-plans", icon: FileText, group: "Navigate" },
  { label: "New Workforce Plan", href: "/workforce-plans/new", icon: FileText, group: "Actions" },
  { label: "Headcount Planning", href: "/headcount", icon: Users, group: "Navigate" },
  { label: "Scenario Modeler", href: "/headcount/scenarios", icon: BarChart3, group: "Navigate" },
  { label: "Org Design Canvas", href: "/org-design", icon: Users, group: "Navigate" },
  { label: "Skills Intelligence", href: "/skills-intelligence", icon: Brain, group: "Navigate" },
  { label: "AI & Digital Labor", href: "/ai-workforce", icon: Zap, group: "Navigate" },
  { label: "AI Agent Control Center", href: "/ai-agents", icon: Bot, group: "Navigate" },
  { label: "Attrition Predictor", href: "/ai-agents/attrition", icon: Bot, group: "AI Agents" },
  { label: "Market Intelligence", href: "/ai-agents/market", icon: Bot, group: "AI Agents" },
  { label: "Collaboration Advisor", href: "/ai-agents/collaboration", icon: Bot, group: "AI Agents" },
  { label: "Analytics Hub", href: "/analytics", icon: BarChart3, group: "Navigate" },
  { label: "Stakeholder Decks", href: "/stakeholder", icon: FileText, group: "Navigate" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenCopilot: () => void;
}

export function CommandPalette({ open, onClose, onOpenCopilot }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleCommand = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 rounded-xl border border-white/12 shadow-2xl overflow-hidden"
            style={{ background: "#1A2235" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
              <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <input
                ref={inputRef}
                placeholder="Search pages, actions, or type 'Ask AI'..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#94A3B8]/60"
              />
              <kbd className="text-[10px] font-mono bg-white/8 px-1.5 py-0.5 rounded text-[#94A3B8]">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {/* Ask AI action */}
              <div className="px-2 mb-2">
                <button
                  onClick={() => { onOpenCopilot(); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/15 transition-colors"
                >
                  <Bot className="w-4 h-4 text-[#A78BFA]" />
                  <span className="text-sm text-[#A78BFA] flex-1 text-left">Ask SWOP Copilot...</span>
                  <ArrowRight className="w-3 h-3 text-[#A78BFA]/50" />
                </button>
              </div>

              {["Navigate", "Actions", "AI Agents"].map((group) => {
                const items = COMMANDS.filter((c) => c.group === group);
                if (!items.length) return null;
                return (
                  <div key={group} className="px-2 mb-2">
                    <div className="px-2 mb-1 text-[10px] font-semibold text-[#94A3B8]/50 tracking-widest uppercase">{group}</div>
                    {items.map((cmd) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.href}
                          onClick={() => handleCommand(cmd.href)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[#94A3B8]" />
                          <span className="text-sm text-[#F1F5F9]">{cmd.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-2 border-t border-white/8 flex items-center gap-4 text-[11px] text-[#94A3B8]/50">
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> select</span>
              <span><kbd className="font-mono">esc</kbd> close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
