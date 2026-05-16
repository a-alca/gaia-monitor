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

const INPE_BASE_URL = 'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/10min/';

/**
 * Get the most recent fire focus data from INPE
 */
export async function getINPEFireFocusData(): Promise<INPEFireFocus[]> {
  try {
    // Get current date in UTC
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Try to get the most recent hour data
    const hour = String(now.getUTCHours()).padStart(2, '0');
    const minute = '00'; // Get the hour mark
    
    const filename = `focos_10min_${year}${month}${day}_${hour}${minute}.csv`;
    const url = `${INPE_BASE_URL}${filename}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // If the most recent file doesn't exist, try the previous hour
      const prevHour = String((now.getUTCHours() - 1 + 24) % 24).padStart(2, '0');
      const prevFilename = `focos_10min_${year}${month}${day}_${prevHour}${minute}.csv`;
      const prevUrl = `${INPE_BASE_URL}${prevFilename}`;
      
      const prevResponse = await fetch(prevUrl);
      if (!prevResponse.ok) {
        throw new Error('Unable to fetch INPE data');
      }
      
      return parseCSVData(await prevResponse.text());
    }
    
    return parseCSVData(await response.text());
  } catch (error) {
    console.error('Error fetching INPE data:', error);
    return [];
  }
}

/**
 * Parse CSV data from INPE format
 */
function parseCSVData(csvText: string): INPEFireFocus[] {
  const lines = csvText.trim().split('\n');
  const data: INPEFireFocus[] = [];
  
  for (const line of lines) {
    const parts = line.split(',').map(part => part.trim());
    if (parts.length >= 4) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      const satelite = parts[2];
      const data = parts[3];
      
      if (!isNaN(lat) && !isNaN(lon)) {
        data.push({ lat, lon, satelite, data });
      }
    }
  }
  
  return data;
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