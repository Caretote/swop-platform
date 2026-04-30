"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { AICopilotPanel } from "@/components/ai-copilot/AICopilotPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setCopilotOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--swop-bg)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          onOpenCopilot={() => setCopilotOpen(true)}
          onOpenCommandPalette={() => setCmdOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenCopilot={() => { setCopilotOpen(true); setCmdOpen(false); }}
      />

      <AICopilotPanel
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </div>
  );
}
