import { create } from 'zustand';
import { ClimateData, WildfireData, AirQualityData, RainfallData, EnvironmentalAlert } from '@/types';

interface EnvironmentState {
  climateData: ClimateData | null;
  wildfireData: WildfireData[];
  airQualityData: AirQualityData | null;
  rainfallData: RainfallData[];
  alerts: EnvironmentalAlert[];
  loading: boolean;
  error: string | null;
  setClimateData: (data: ClimateData) => void;
  setWildfireData: (data: WildfireData[]) => void;
  setAirQualityData: (data: AirQualityData) => void;
  setRainfallData: (data: RainfallData[]) => void;
  setAlerts: (alerts: EnvironmentalAlert[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  climateData: null,
  wildfireData: [],
  airQualityData: null,
  rainfallData: [],
  alerts: [],
  loading: false,
  error: null,
  setClimateData: (data) => set({ climateData: data }),
  setWildfireData: (data) => set({ wildfireData: data }),
  setAirQualityData: (data) => set({ airQualityData: data }),
  setRainfallData: (data) => set({ rainfallData: data }),
  setAlerts: (alerts) => set({ alerts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));