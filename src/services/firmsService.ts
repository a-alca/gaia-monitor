// NASA FIRMS API integration service
// Documentation: https://firms.modaps.eosdis.nasa.gov/api/

import { WildfireData } from '@/types';

export interface FIRMSFireData {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  instrument: string;
  confidence: string;
  version: string;
  bright_t31: number;
  frp: number;
  daynight: string;
  type: number;
}

export interface FIRMSAreaParams {
  map_key: string;
  area_coords: string; // Format: "min_lon,min_lat,max_lon,max_lat"
  date_range: string; // Format: "2023-01-01/2023-01-02"
  sensor?: string; // Default: MODIS_NRT
}

/**
 * Get fire data for a specific area from NASA FIRMS API
 */
export async function getFIRMSAreaData(params: FIRMSAreaParams): Promise<FIRMSFireData[]> {
  const { map_key, area_coords, date_range, sensor = 'MODIS_NRT' } = params;
  
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${map_key}/${sensor}/${area_coords}/${date_range}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.status}`);
    }
    
    const csvData = await response.text();
    return parseFIRMSCSV(csvData);
  } catch (error) {
    console.error('Error fetching FIRMS data:', error);
    throw error;
  }
}

/**
 * Parse FIRMS CSV data to array of objects
 */
function parseFIRMSCSV(csvData: string): FIRMSFireData[] {
  const lines = csvData.trim().split('\n');
  if (lines.length < 2) return []; // No data or header only
  
  const headers = lines[0].split(',');
  const data: FIRMSFireData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) continue;
    
    const fireData: FIRMSFireData = {
      latitude: parseFloat(values[0]),
      longitude: parseFloat(values[1]),
      brightness: parseFloat(values[2]),
      scan: parseFloat(values[3]),
      track: parseFloat(values[4]),
      acq_date: values[5],
      acq_time: values[6],
      satellite: values[7],
      instrument: values[8],
      confidence: values[9],
      version: values[10],
      bright_t31: parseFloat(values[11]),
      frp: parseFloat(values[12]),
      daynight: values[13],
      type: parseInt(values[14]),
    };
    
    data.push(fireData);
  }
  
  return data;
}

/**
 * Get Brazil's bounding box coordinates
 */
export function getBrazilBoundingBox(): string {
  // Brazil bounding box: min_lon,min_lat,max_lon,max_lat
  return '-74.0,-34.0,-34.0,5.0';
}

/**
 * Get date range for the last N days
 */
export function getDateRange(days: number = 1): string {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  return `${formatDate(startDate)}/${formatDate(endDate)}`;
}

/**
 * Get mock fire data for testing (when API key is not available)
 */
export function getMockFIRMSData(): FIRMSFireData[] {
  return [
    {
      latitude: -11.14,
      longitude: -51.08,
      brightness: 352,
      scan: 1.2,
      track: 1.1,
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: '12:30',
      satellite: 'Terra',
      instrument: 'MODIS',
      confidence: 'high',
      version: '1.0',
      bright_t31: 320,
      frp: 15.5,
      daynight: 'D',
      type: 0,
    },
    {
      latitude: -11.32,
      longitude: -50.78,
      brightness: 381,
      scan: 1.3,
      track: 1.2,
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: '14:45',
      satellite: 'Aqua',
      instrument: 'MODIS',
      confidence: 'high',
      version: '1.0',
      bright_t31: 340,
      frp: 22.3,
      daynight: 'D',
      type: 0,
    },
    {
      latitude: -12.14,
      longitude: -50.36,
      brightness: 400,
      scan: 1.1,
      track: 1.0,
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: '16:20',
      satellite: 'Terra',
      instrument: 'MODIS',
      confidence: 'high',
      version: '1.0',
      bright_t31: 360,
      frp: 35.7,
      daynight: 'D',
      type: 0,
    },
  ];
}

/**
 * Get fire data with automatic fallback to mock data
 */
export async function getFireData(useRealAPI: boolean = false): Promise<FIRMSFireData[]> {
  const mapKey = process.env.NEXT_PUBLIC_FIRMS_MAP_KEY;
  
  if (!useRealAPI || !mapKey) {
    console.log('Using mock FIRMS data (no API key or real API disabled)');
    return getMockFIRMSData();
  }
  
  try {
    const areaCoords = getBrazilBoundingBox();
    const dateRange = getDateRange(1); // Last 1 day
    
    const data = await getFIRMSAreaData({
      map_key: mapKey,
      area_coords: areaCoords,
      date_range: dateRange,
      sensor: 'MODIS_NRT',
    });
    
    console.log(`Fetched ${data.length} fire detections from FIRMS API`);
    return data;
  } catch (error) {
    console.error('Error fetching real FIRMS data, falling back to mock data:', error);
    return getMockFIRMSData();
  }
}

/**
 * Convert FIRMS data to WildfireData format
 */
export async function convertFIRMSDataToWildfireData(firmsData: FIRMSFireData[]): Promise<WildfireData[]> {
  const wildfireData: WildfireData[] = [];
  
  for (const fire of firmsData) {
    try {
      // Get location name from coordinates (with timeout and fallback)
      const locationName = await getLocationNameWithFallback(fire.latitude, fire.longitude);
      
      // Determine intensity based on brightness and FRP
      const intensity = determineIntensity(fire.brightness, fire.frp);
      
      // Estimate area based on FRP (Fire Radiative Power)
      // This is a rough estimation: FRP (MW) can indicate fire size
      const estimatedArea = estimateArea(fire.frp);
      
      // Parse date and time
      const detectedAt = parseDateTime(fire.acq_date, fire.acq_time);
      
      const wildfire: WildfireData = {
        id: `${fire.latitude}-${fire.longitude}-${fire.acq_date}-${fire.acq_time}`,
        location: {
          lat: fire.latitude,
          lng: fire.longitude,
          name: locationName,
        },
        intensity,
        area: estimatedArea,
        status: 'active', // All FIRMS detections are current/active
        detectedAt,
        lastUpdated: detectedAt,
      };
      
      wildfireData.push(wildfire);
    } catch (error) {
      console.error('Error converting FIRMS data:', error);
      // Add a fallback entry even if there's an error
      const fallbackWildfire: WildfireData = {
        id: `${fire.latitude}-${fire.longitude}-${fire.acq_date}-${fire.acq_time}`,
        location: {
          lat: fire.latitude,
          lng: fire.longitude,
          name: 'Local desconhecido',
        },
        intensity: 'low',
        area: 1,
        status: 'active',
        detectedAt: parseDateTime(fire.acq_date, fire.acq_time),
        lastUpdated: parseDateTime(fire.acq_date, fire.acq_time),
      };
      
      wildfireData.push(fallbackWildfire);
    }
  }
  
  return wildfireData;
}

/**
 * Get location name from coordinates using OpenStreetMap Nominatim with timeout and fallback
 */
async function getLocationNameWithFallback(latitude: number, longitude: number): Promise<string> {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=pt-BR`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GaiaMonitor/1.0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Geocoding failed with status: ${response.status}`);
      return getGenericLocationName(latitude, longitude);
    }
    
    const data = await response.json();
    
    // Try multiple possible city fields
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.municipality || 
                 data.address?.county ||
                 data.name ||
                 null;
    
    if (city) {
      return city;
    }
    
    return getGenericLocationName(latitude, longitude);
  } catch (error) {
    console.error('Error getting location name:', error);
    return getGenericLocationName(latitude, longitude);
  }
}

/**
 * Get generic location name based on coordinates (fallback)
 */
function getGenericLocationName(latitude: number, longitude: number): string {
  // Return a generic description based on coordinates
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `Região ${Math.abs(latitude).toFixed(2)}°${latDir}, ${Math.abs(longitude).toFixed(2)}°${lngDir}`;
}

/**
 * Determine fire intensity based on brightness and FRP
 */
function determineIntensity(brightness: number, frp: number): 'low' | 'medium' | 'high' | 'extreme' {
  // Combined logic using both brightness temperature and Fire Radiative Power
  if (brightness >= 400 || frp >= 50) return 'extreme';
  if (brightness >= 375 || frp >= 30) return 'high';
  if (brightness >= 350 || frp >= 15) return 'medium';
  return 'low';
}

/**
 * Estimate fire area based on FRP (rough estimation)
 * FRP in MW can indicate fire size and intensity
 */
function estimateArea(frp: number): number {
  // Rough estimation: each MW of FRP ≈ 0.5-2 hectares depending on fuel type
  // Using a conservative average of 1 hectare per MW
  return Math.max(1, Math.round(frp)); // Minimum 1 hectare
}

/**
 * Parse date and time from FIRMS format
 */
function parseDateTime(dateStr: string, timeStr: string): Date {
  // FIRMS date format: YYYY-MM-DD
  // FIRMS time format: HH:mm
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * Get wildfire data in WildfireData format
 */
export async function getWildfireData(useRealAPI: boolean = false): Promise<WildfireData[]> {
  try {
    const firmsData = await getFireData(useRealAPI);
    
    if (!firmsData || firmsData.length === 0) {
      console.log('No FIRMS data available, returning empty array');
      return [];
    }
    
    return await convertFIRMSDataToWildfireData(firmsData);
  } catch (error) {
    console.error('Error in getWildfireData:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}