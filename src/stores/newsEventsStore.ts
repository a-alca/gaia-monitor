import { create } from 'zustand';
import { News, Event } from '@/types';

interface NewsEventsState {
  news: News[];
  events: Event[];
  loading: boolean;
  error: string | null;
  selectedNews: News | null;
  selectedEvent: Event | null;
  setNews: (news: News[]) => void;
  setEvents: (events: Event[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedNews: (news: News | null) => void;
  setSelectedEvent: (event: Event | null) => void;
  fetchNews: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  getNewsById: (id: string) => News | undefined;
  getEventById: (id: string) => Event | undefined;
}

export const useNewsEventsStore = create<NewsEventsState>((set, get) => ({
  news: [],
  events: [],
  loading: false,
  error: null,
  selectedNews: null,
  selectedEvent: null,
  
  setNews: (news) => set({ news }),
  setEvents: (events) => set({ events }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedNews: (news) => set({ selectedNews: news }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  fetchNews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      set({ news: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        loading: false 
      });
    }
  },
  
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      set({ events: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch events',
        loading: false 
      });
    }
  },
  
  getNewsById: (id: string) => {
    return get().news.find(news => news.id === id);
  },
  
  getEventById: (id: string) => {
    return get().events.find(event => event.id === id);
  },
}));