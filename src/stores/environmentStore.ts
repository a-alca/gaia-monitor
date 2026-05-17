import { create } from 'zustand';
import { ClimateData, WildfireData, AirQualityData, RainfallData, EnvironmentalAlert } from '@/types';
import { getWildfireData as getINPEWildfireData } from '@/services/inpeService';

interface EnvironmentState {
  climateData: ClimateData | null;
  wildfireData: WildfireData[];
  airQualityData: AirQualityData | null;
  rainfallData: RainfallData[];
  alerts: EnvironmentalAlert[];
  loading: boolean;
  error: string | null;
  useRealData: boolean;
  setClimateData: (data: ClimateData) => void;
  setWildfireData: (data: WildfireData[]) => void;
  setAirQualityData: (data: AirQualityData) => void;
  setRainfallData: (data: RainfallData[]) => void;
  setAlerts: (alerts: EnvironmentalAlert[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUseRealData: (useReal: boolean) => void;
  fetchRealWildfireData: () => Promise<void>;
  fetchClimateData: (lat?: number, lon?: number) => Promise<void>;
  fetchAirQualityData: (lat?: number, lon?: number) => Promise<void>;
}

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  climateData: null,
  wildfireData: [],
  airQualityData: null,
  rainfallData: [],
  alerts: [],
  loading: false,
  error: null,
  useRealData: false,
  setClimateData: (data) => set({ climateData: data }),
  setWildfireData: (data) => set({ wildfireData: data }),
  setAirQualityData: (data) => set({ airQualityData: data }),
  setRainfallData: (data) => set({ rainfallData: data }),
  setAlerts: (alerts) => set({ alerts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setUseRealData: (useReal) => set({ useRealData: useReal }),
  
  fetchRealWildfireData: async () => {
    set({ loading: true, error: null });
    try {
      const realData = await getINPEWildfireData();
      set({ wildfireData: realData, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch wildfire data',
        loading: false 
      });
    }
  },

  fetchClimateData: async (lat?: number, lon?: number) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (lat) params.append('lat', lat.toString());
      if (lon) params.append('lon', lon.toString());
      
      const response = await fetch(`/api/climate?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch climate data');
      }
      const data = await response.json();
      set({ climateData: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch climate data',
        loading: false 
      });
    }
  },

  fetchAirQualityData: async (lat?: number, lon?: number) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (lat) params.append('lat', lat.toString());
      if (lon) params.append('lon', lon.toString());
      
      const response = await fetch(`/api/air-quality?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      const data = await response.json();
      set({ airQualityData: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch air quality data',
        loading: false 
      });
    }
  },
}));