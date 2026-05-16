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
}));