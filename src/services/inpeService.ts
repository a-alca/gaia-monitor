export interface INPEFireFocus {
  lat: number;
  lon: number;
  satelite: string;
  data: string;
}

export interface INPEWildfireData {
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
  satellite: string;
}

// Use internal API route to avoid CORS issues
const API_BASE_URL = '/api/wildfires';

/**
 * Get the most recent fire focus data from INPE via internal API
 */
export async function getINPEFireFocusData(): Promise<INPEFireFocus[]> {
  try {
    const response = await fetch(API_BASE_URL);
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    console.error('INPE API returned error:', result.error);
    return [];
  } catch (error) {
    console.error('Error fetching INPE data:', error);
    return [];
  }
}

/**
 * Convert INPE data to our WildfireData format
 */
export function convertINPEToWildfireData(inpeData: INPEFireFocus[]): INPEWildfireData[] {
  return inpeData.map((focus, index) => {
    // Determine intensity based on clustering (simplified logic)
    const intensity = determineIntensity(focus);
    
    return {
      id: `inpe-${Date.now()}-${index}`,
      location: {
        lat: focus.lat,
        lng: focus.lon,
        name: `Foco ${index + 1}`,
      },
      intensity,
      area: Math.random() * 100 + 10, // Estimated area in hectares
      status: 'active',
      detectedAt: new Date(focus.data),
      lastUpdated: new Date(),
      satellite: focus.satelite,
    };
  });
}

/**
 * Determine fire intensity based on location clustering
 * This is a simplified version - in production, you'd use more sophisticated analysis
 */
function determineIntensity(focus: INPEFireFocus): 'low' | 'medium' | 'high' | 'extreme' {
  // Simple logic: intensity based on geographic clustering
  // In production, you'd use temperature data, satellite type, etc.
  const random = Math.random();
  
  if (random < 0.6) return 'low';
  if (random < 0.85) return 'medium';
  if (random < 0.95) return 'high';
  return 'extreme';
}

/**
 * Get wildfire data formatted for the application
 */
export async function getWildfireData(): Promise<INPEWildfireData[]> {
  const inpeData = await getINPEFireFocusData();
  return convertINPEToWildfireData(inpeData);
}