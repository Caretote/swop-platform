import { create } from "zustand";

type AgentStatus = "idle" | "running" | "complete" | "error";

interface AgentRun {
  id: string;
  agentType: string;
  status: AgentStatus;
  startedAt: number;
  completedAt?: number;
  tokensUsed?: number;
  result?: unknown;
  error?: string;
}

interface AgentStore {
  runs: AgentRun[];
  activeRuns: Record<string, AgentRun>;
  startRun: (agentType: string) => string;
  completeRun: (runId: string, result: unknown, tokensUsed?: number) => void;
  failRun: (runId: string, error: string) => void;
  clearHistory: () => void;
  getTodayStats: () => { totalRuns: number; totalTokens: number };
}

let runCounter = 0;

export const useAgentStore = create<AgentStore>((set, get) => ({
  runs: [],
  activeRuns: {},

  startRun: (agentType) => {
    const id = `run_${++runCounter}_${Date.now()}`;
    const run: AgentRun = { id, agentType, status: "running", startedAt: Date.now() };
    set((state) => ({
      runs: [run, ...state.runs],
      activeRuns: { ...state.activeRuns, [id]: run },
    }));
    return id;
  },

  completeRun: (runId, result, tokensUsed) =>
    set((state) => {
      const updated = state.runs.map((r) =>
        r.id === runId ? { ...r, status: "complete" as AgentStatus, completedAt: Date.now(), result, tokensUsed } : r
      );
      const { [runId]: _, ...activeRuns } = state.activeRuns;
      return { runs: updated, activeRuns };
    }),

  failRun: (runId, error) =>
    set((state) => {
      const updated = state.runs.map((r) =>
        r.id === runId ? { ...r, status: "error" as AgentStatus, completedAt: Date.now(), error } : r
      );
      const { [runId]: _, ...activeRuns } = state.activeRuns;
      return { runs: updated, activeRuns };
    }),

  clearHistory: () => set({ runs: [], activeRuns: {} }),

  getTodayStats: () => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayRuns = get().runs.filter((r) => r.startedAt >= todayStart);
    return {
      totalRuns: todayRuns.length,
      totalTokens: todayRuns.reduce((a, r) => a + (r.tokensUsed ?? 0), 0),
    };
  },
}));
