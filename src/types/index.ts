export interface ClimateData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  timestamp: Date;
}

export interface WildfireData {
  id: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  area: number;
  status: 'active' | 'contained' | 'controlled';
  detectedAt: Date;
  lastUpdated: Date;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  category: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  timestamp: Date;
}

export interface RainfallData {
  amount: number;
  intensity: 'light' | 'moderate' | 'heavy' | 'extreme';
  probability: number;
  timestamp: Date;
}

export interface EnvironmentalAlert {
  id: string;
  type: 'wildfire' | 'flood' | 'storm' | 'heatwave' | 'coldwave' | 'air-quality' | 'other';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'conference' | 'workshop' | 'meeting' | 'course' | 'other';
  date: Date;
  location: string;
  organizer: string;
  attendees?: number;
  isVirtual: boolean;
  registrationUrl?: string;
  imageUrl?: string;
}

export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author?: string;
  publishedAt: Date;
  imageUrl?: string;
  category: string;
  tags: string[];
  externalUrl?: string;
}

export interface TerritoryData {
  id: string;
  name: string;
  type: 'state' | 'city' | 'region' | 'protected-area' | 'indigenous-land';
  area: number;
  population?: number;
  deforestationRate?: number;
  biodiversityIndex?: number;
  boundaries: {
    lat: number;
    lng: number;
  }[];
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'climate' | 'wildfire' | 'rainfall' | 'deforestation' | 'protected-areas' | 'territory';
  isVisible: boolean;
  opacity: number;
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
  country?: string;
  region?: string;
}