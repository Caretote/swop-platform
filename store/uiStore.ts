import { create } from "zustand";

interface UIStore {
  sidebarCollapsed: boolean;
  copilotOpen: boolean;
  cmdOpen: boolean;
  deepThinkMode: boolean;
  activeModal: string | null;
  notifications: Notification[];
  toggleSidebar: () => void;
  toggleCopilot: () => void;
  setCopilotOpen: (open: boolean) => void;
  toggleCmd: () => void;
  setCmdOpen: (open: boolean) => void;
  toggleDeepThink: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt">) => void;
  dismissNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  createdAt: number;
}

let notifCounter = 0;

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  copilotOpen: false,
  cmdOpen: false,
  deepThinkMode: false,
  activeModal: null,
  notifications: [],

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  toggleCmd: () => set((s) => ({ cmdOpen: !s.cmdOpen })),
  setCmdOpen: (open) => set({ cmdOpen: open }),
  toggleDeepThink: () => set((s) => ({ deepThinkMode: !s.deepThinkMode })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { ...n, id: `notif_${++notifCounter}`, createdAt: Date.now() },
        ...state.notifications.slice(0, 9),
      ],
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
