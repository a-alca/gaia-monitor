// Open-Meteo API integration service
// Documentation: https://open-meteo.com/en/docs

export interface OpenMeteoCurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface OpenMeteoHourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  uv_index: number[];
  visibility: number[];
}

export interface OpenMeteoDailyData {
  time: string[];
  uv_index_max: number[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: any;
  hourly_units: any;
  daily_units: any;
  current: OpenMeteoCurrentWeather;
  hourly: OpenMeteoHourlyData;
  daily: OpenMeteoDailyData;
}

export interface OpenMeteoAirQualityCurrent {
  time: string;
  interval: number;
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  european_aqi: number;
  us_aqi: number;
}

export interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: any;
  hourly_units: any;
  current: OpenMeteoAirQualityCurrent;
  hourly: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide: number[];
    nitrogen_dioxide: number[];
    sulphur_dioxide: number[];
    ozone: number[];
    european_aqi: number[];
    us_aqi: number[];
  };
}

// Weather code to description mapping (WMO codes)
export function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa densa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte',
  };
  return weatherCodes[code] || 'Condição desconhecida';
}

// Wind direction to cardinal mapping
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Get climate data for a specific location
export async function getClimateData(
  latitude: number = -23.5505, // Default: São Paulo
  longitude: number = -46.6333
): Promise<OpenMeteoResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,wind_direction_10m,uv_index,visibility&daily=uv_index_max&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch climate data from Open-Meteo');
  }
  return response.json();
}

// Get air quality data for a specific location
export async function getAirQualityData(
  latitude: number = -23.5505, // Default: São Paulo
  longitude: number = -46.6333
): Promise<OpenMeteoAirQualityResponse> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch air quality data from Open-Meteo');
  }
  return response.json();
}

// Get AQI category based on US AQI
export function getAQICategory(aqi: number): 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous' {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
}

// Historical data interfaces
export interface HistoricalTemperatureData {
  date: string;
  temperature: number;
  apparentTemperature: number;
  maxTemperature: number;
  minTemperature: number;
}

export interface HistoricalWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: any;
  daily: {
    time: string[];
    temperature_2m_mean: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_mean: number[];
  };
}

// Get historical temperature data for comparison
export async function getHistoricalTemperatureData(
  latitude: number = -23.5505,
  longitude: number = -46.6333,
  startDate: string,
  endDate: string
): Promise<HistoricalWeatherResponse> {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min,apparent_temperature_mean&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch historical temperature data from Open-Meteo');
  }
  return response.json();
}

// Get historical data for the past 30 days for comparison
export async function getRecentHistoricalData(
  latitude: number = -23.5505,
  longitude: number = -46.6333
): Promise<HistoricalTemperatureData[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  const data = await getHistoricalTemperatureData(latitude, longitude, startDateStr, endDateStr);

  return data.daily.time.map((date, index) => ({
    date,
    temperature: Math.round(data.daily.temperature_2m_mean[index]),
    apparentTemperature: Math.round(data.daily.apparent_temperature_mean[index]),
    maxTemperature: Math.round(data.daily.temperature_2m_max[index]),
    minTemperature: Math.round(data.daily.temperature_2m_min[index]),
  }));
}

// Get historical data for the same day in previous years
export async function getSameDayHistoricalData(
  latitude: number = -23.5505,
  longitude: number = -46.6333,
  yearsBack: number = 5
): Promise<HistoricalTemperatureData[]> {
  const today = new Date();
  const historicalData: HistoricalTemperatureData[] = [];

  for (let i = 1; i <= yearsBack; i++) {
    const pastDate = new Date(today);
    pastDate.setFullYear(today.getFullYear() - i);
    
    const dateStr = pastDate.toISOString().split('T')[0];
    const startDateStr = dateStr;
    const endDateStr = dateStr;

    try {
      const data = await getHistoricalTemperatureData(latitude, longitude, startDateStr, endDateStr);
      
      if (data.daily.time.length > 0) {
        historicalData.push({
          date: data.daily.time[0],
          temperature: Math.round(data.daily.temperature_2m_mean[0]),
          apparentTemperature: Math.round(data.daily.apparent_temperature_mean[0]),
          maxTemperature: Math.round(data.daily.temperature_2m_max[0]),
          minTemperature: Math.round(data.daily.temperature_2m_min[0]),
        });
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${dateStr}:`, error);
    }
  }

  return historicalData;
}