import { create } from "zustand";

interface ScenarioLineItem {
  id: string;
  role: string;
  level: string;
  qty: number;
  salary: number;
  bu: string;
  startDate: string;
}

interface Scenario {
  id: string;
  name: string;
  lineItems: ScenarioLineItem[];
}

interface Plan {
  id: string;
  name: string;
  status: string;
  scenarios: Scenario[];
}

interface PlanStore {
  plans: Plan[];
  activePlanId: string | null;
  activeScenarioId: string | null;
  setActivePlan: (id: string) => void;
  setActiveScenario: (id: string) => void;
  addLineItem: (planId: string, scenarioId: string, item: ScenarioLineItem) => void;
  removeLineItem: (planId: string, scenarioId: string, itemId: string) => void;
  updateLineItem: (planId: string, scenarioId: string, itemId: string, updates: Partial<ScenarioLineItem>) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  plans: [],
  activePlanId: null,
  activeScenarioId: null,

  setActivePlan: (id) => set({ activePlanId: id }),
  setActiveScenario: (id) => set({ activeScenarioId: id }),

  addLineItem: (planId, scenarioId, item) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId
          ? {
              ...p,
              scenarios: p.scenarios.map((s) =>
                s.id === scenarioId ? { ...s, lineItems: [...s.lineItems, item] } : s
              ),
            }
          : p
      ),
    })),

  removeLineItem: (planId, scenarioId, itemId) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId
          ? {
              ...p,
              scenarios: p.scenarios.map((s) =>
                s.id === scenarioId
                  ? { ...s, lineItems: s.lineItems.filter((li) => li.id !== itemId) }
                  : s
              ),
            }
          : p
      ),
    })),

  updateLineItem: (planId, scenarioId, itemId, updates) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId
          ? {
              ...p,
              scenarios: p.scenarios.map((s) =>
                s.id === scenarioId
                  ? {
                      ...s,
                      lineItems: s.lineItems.map((li) =>
                        li.id === itemId ? { ...li, ...updates } : li
                      ),
                    }
                  : s
              ),
            }
          : p
      ),
    })),
}));
