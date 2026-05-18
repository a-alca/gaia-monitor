import { create } from 'zustand';
import { Location } from '@/types';
import { getLocationInfo } from '@/services/geolocationService';

interface LocationState {
  currentLocation: Location | null;
  selectedLocation: Location | null;
  locations: Location[];
  loading: boolean;
  error: string | null;
  setCurrentLocation: (location: Location) => void;
  setSelectedLocation: (location: Location | null) => void;
  setLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  fetchCurrentLocation: () => Promise<void>;
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
  loading: false,
  error: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setLocations: (locations) => set({ locations }),
  addLocation: (location) => set((state) => ({ locations: [...state.locations, location] })),
  removeLocation: (id: string) => set((state) => ({
    locations: state.locations.filter((loc) => loc.name !== id)
  })),
  fetchCurrentLocation: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching current location...');
      const { position, address } = await getLocationInfo();
      
      console.log('Location obtained:', { position, address });
      console.log('City name from address:', address.city);
      
      const location: Location = {
        lat: position.latitude,
        lng: position.longitude,
        name: address.city,
        country: address.country,
        region: address.region,
      };
      
      console.log('Setting new location:', location);
      set({ currentLocation: location, loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch current location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter geolocalização';
      console.error('Error message:', errorMessage);
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },
}));