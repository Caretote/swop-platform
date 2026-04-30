"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Send, Sparkles, Brain, ChevronDown, ChevronUp, Copy, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "What are our top 3 workforce risks this quarter?",
  "How many hires needed for 15% revenue growth?",
  "Which roles have the highest automation risk?",
  "Draft executive summary for FY2026 workforce plan",
  "Analyze span of control issues in Sales org",
  "Compare headcount growth: Sales vs Engineering",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  isStreaming?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AICopilotPanel({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deepThink, setDeepThink] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || isLoading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "", isStreaming: true }]);
    setIsLoading(true);

    try {
      const resp = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, deepThink, history: messages.slice(-6) }),
      });

      if (!resp.ok) throw new Error("Request failed");
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
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text") {
                setMessages((prev) => prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + data.text } : m
                ));
              }
              if (data.type === "thinking") {
                setMessages((prev) => prev.map((m) =>
                  m.id === assistantId ? { ...m, thinking: (m.thinking ?? "") + data.text } : m
                ));
              }
            } catch { /* skip */ }
          }
        }
      }

      setMessages((prev) => prev.map((m) =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      ));
    } catch {
      setMessages((prev) => prev.map((m) =>
        m.id === assistantId ? { ...m, content: "Sorry, there was an error. Please check your API key.", isStreaming: false } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn(
              "fixed bottom-0 right-0 z-50 flex flex-col border-l border-t border-white/10 shadow-2xl overflow-hidden",
              expanded ? "inset-0 rounded-none" : "w-[480px] h-[70vh] rounded-tl-2xl"
            )}
            style={{ background: "#1A2235" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center glow-purple">
                  <Bot className="w-3.5 h-3.5 text-[#A78BFA]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>SWOP Copilot</div>
                  <div className="text-[10px] text-[#94A3B8]">Strategic Workforce AI</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Deep Think toggle */}
                <button
                  onClick={() => setDeepThink(!deepThink)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-all",
                    deepThink
                      ? "bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#A78BFA]"
                      : "bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/8"
                  )}
                >
                  <Brain className="w-3 h-3" />
                  {deepThink ? "Deep Think ON" : "Deep Think"}
                </button>
                <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-white/5 text-[#94A3B8]">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[#94A3B8]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#A78BFA]" />
                    </div>
                    <p className="text-sm text-[#94A3B8]">Ask anything about Acme Corp&apos;s workforce</p>
                    {deepThink && <p className="text-xs text-[#A78BFA] mt-1">Deep Think mode: extended reasoning enabled</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        className="text-left px-3 py-2 rounded-lg border border-white/8 hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5 transition-all text-sm text-[#94A3B8] hover:text-white"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
                  <div className={cn(
                    "w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] text-white"
                      : "bg-[#8B5CF6]/20 border border-[#8B5CF6]/30"
                  )}>
                    {msg.role === "user" ? "AC" : <Bot className="w-3.5 h-3.5 text-[#A78BFA]" />}
                  </div>
                  <div className={cn("flex-1 min-w-0", msg.role === "user" && "items-end flex flex-col")}>
                    {msg.role === "user" ? (
                      <div className="inline-block px-3 py-2 rounded-2xl rounded-tr-sm bg-[#2563EB]/20 border border-[#2563EB]/25 text-sm text-white max-w-[85%]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {msg.thinking && (
                          <div className="rounded-lg border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 overflow-hidden">
                            <button
                              onClick={() => setExpandedThinking(expandedThinking === msg.id ? null : msg.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-[11px] text-[#A78BFA]"
                            >
                              <Brain className="w-3 h-3" />
                              Reasoning trace
                              {expandedThinking === msg.id ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                            </button>
                            {expandedThinking === msg.id && (
                              <div className="px-3 pb-3 text-[11px] text-[#94A3B8] font-mono leading-relaxed whitespace-pre-wrap border-t border-[#8B5CF6]/15">
                                {msg.thinking}
                              </div>
                            )}
                          </div>
                        )}
                        <div className={cn("ai-prose text-sm leading-relaxed", msg.isStreaming && "after:content-['▋'] after:animate-pulse after:text-[#2563EB]")}>
                          {msg.content}
                          {msg.isStreaming && !msg.content && (
                            <span className="inline-block w-2 h-4 bg-[#2563EB] animate-pulse rounded-sm" />
                          )}
                        </div>
                        {!msg.isStreaming && msg.content && (
                          <button
                            onClick={() => navigator.clipboard.writeText(msg.content)}
                            className="flex items-center gap-1 text-[11px] text-[#94A3B8]/50 hover:text-[#94A3B8] transition-colors"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/8 shrink-0">
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask about workforce data, risks, plans..."
                  className="flex-1 bg-transparent text-sm text-white outline-none resize-none placeholder:text-[#94A3B8]/50 max-h-24"
                  rows={1}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-[#94A3B8]/40 text-center">
                {deepThink ? "Deep Think enabled — responses take 15–45s but reason through complex strategy" : "Enter to send · Shift+Enter for new line"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
