import { create } from 'zustand';
import { Location } from '@/types';

interface LocationState {
  currentLocation: Location | null;
  selectedLocation: Location | null;
  locations: Location[];
  setCurrentLocation: (location: Location) => void;
  setSelectedLocation: (location: Location | null) => void;
  setLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: {
    lat: -23.5505,
    lng: -46.6333,
    name: 'São Paulo',
    country: 'Brazil',
    region: 'Southeast',
  },
  selectedLocation: null,
  locations: [],
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setLocations: (locations) => set({ locations }),
  addLocation: (location) => set((state) => ({ locations: [...state.locations, location] })),
  removeLocation: (id) => set((state) => ({
    locations: state.locations.filter((loc) => loc !== id)
  })),
}));