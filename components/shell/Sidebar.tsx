"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Network, BarChart3, Brain, Sparkles,
  TrendingUp, FileText, Settings, ChevronLeft, ChevronRight,
  ChevronDown, Bot, LineChart, Shield, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const NAV = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Command Center", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    group: "PLANNING",
    items: [
      { label: "Workforce Plans", href: "/workforce-plans", icon: FileText, badge: "8" },
      { label: "Headcount", href: "/headcount", icon: Users },
      { label: "Scenarios", href: "/headcount/scenarios", icon: TrendingUp },
    ],
  },
  {
    group: "ORG DESIGN",
    items: [
      { label: "Org Design Canvas", href: "/org-design", icon: Network },
    ],
  },
  {
    group: "INTELLIGENCE",
    items: [
      { label: "Skills Intelligence", href: "/skills-intelligence", icon: Brain },
      { label: "AI & Digital Labor", href: "/ai-workforce", icon: Zap },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    group: "AI AGENTS",
    items: [
      { label: "Agent Control Center", href: "/ai-agents", icon: Bot, badge: "7", badgeColor: "purple" },
      { label: "Attrition Predictor", href: "/ai-agents/attrition", icon: Shield },
      { label: "Market Intelligence", href: "/ai-agents/market", icon: LineChart },
      { label: "Document Ingestion", href: "/ai-agents/ingestion", icon: Sparkles },
      { label: "Plan Review", href: "/ai-agents/plan-review", icon: FileText },
      { label: "Collaboration Advisor", href: "/ai-agents/collaboration", icon: Brain, badge: "NEW", badgeColor: "purple" },
    ],
  },
  {
    group: "COLLABORATE",
    items: [
      { label: "Stakeholder Decks", href: "/stakeholder", icon: Users },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: string; badgeColor?: string };

function NavItemRow({ item, collapsed, active }: { item: NavItem; collapsed: boolean; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href}>
      <motion.div
        className={cn(
          "relative flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-white/5",
          active && "bg-white/8 text-white"
        )}
        whileHover={{ x: collapsed ? 0 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {active && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#2563EB] rounded-full"
            style={{ boxShadow: "0 0 8px rgba(37,99,235,0.8)" }}
          />
        )}
        <Icon className={cn("shrink-0 w-4 h-4", active ? "text-[#2563EB]" : "text-[#94A3B8]")} />
        {!collapsed && (
          <>
            <span className={cn("text-sm flex-1 truncate", active ? "text-white font-medium" : "text-[#94A3B8]")}>
              {item.label}
            </span>
            {item.badge && (
              <span className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded font-medium",
                item.badgeColor === "purple"
                  ? "bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30"
                  : "bg-white/8 text-[#94A3B8]"
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </motion.div>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(["SYSTEM"]));

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full border-r border-white/8 overflow-hidden shrink-0"
      style={{ background: "var(--swop-surface)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#8B5CF6] flex items-center justify-center shrink-0 glow-blue">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate" style={{ fontFamily: "var(--font-syne, Syne)" }}>
              SWOP Intelligence Platform
            </div>
            <div className="text-[10px] text-[#94A3B8]/70 truncate">by Michael Jones</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.group)}
                className="flex items-center justify-between w-full px-2 mb-1 group"
              >
                <span className="text-[10px] font-semibold text-[#94A3B8]/60 tracking-widest">{group.group}</span>
                <ChevronDown className={cn("w-3 h-3 text-[#94A3B8]/40 transition-transform", collapsedGroups.has(group.group) && "-rotate-90")} />
              </button>
            )}
            <AnimatePresence initial={false}>
              {(!collapsedGroups.has(group.group) || collapsed) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  {group.items.map((item) => (
                    <NavItemRow
                      key={item.href}
                      item={item}
                      collapsed={collapsed}
                      active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/8 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-[10px] font-bold text-white">MJ</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">Michael Jones</div>
              <div className="text-[10px] text-[#94A3B8] truncate">Acme Corp · Admin</div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full border border-white/10 bg-[#1A2235] flex items-center justify-center hover:border-white/20 transition-colors z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
          : <ChevronLeft className="w-3 h-3 text-[#94A3B8]" />
        }
      </button>
    </motion.aside>
  );
}
