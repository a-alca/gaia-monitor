import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currentRoute: string;
  notifications: number;
  setSidebarOpen: (open: boolean) => void;
  setCurrentRoute: (route: string) => void;
  setNotifications: (count: number) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentRoute: 'dashboard',
  notifications: 0,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setNotifications: (count) => set({ notifications: count }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));