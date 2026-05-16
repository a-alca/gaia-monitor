import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currentRoute: string;
  searchQuery: string;
  notifications: number;
  setSidebarOpen: (open: boolean) => void;
  setCurrentRoute: (route: string) => void;
  setSearchQuery: (query: string) => void;
  setNotifications: (count: number) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currentRoute: 'dashboard',
  searchQuery: '',
  notifications: 0,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setNotifications: (count) => set({ notifications: count }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));