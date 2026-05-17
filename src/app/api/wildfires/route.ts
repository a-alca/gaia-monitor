import { NextResponse } from 'next/server';

const INPE_BASE_URL = 'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/10min/';

export async function GET() {
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
    
    console.log('Fetching INPE data from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // If the most recent file doesn't exist, try the previous hour
      const prevHour = String((now.getUTCHours() - 1 + 24) % 24).padStart(2, '0');
      const prevFilename = `focos_10min_${year}${month}${day}_${prevHour}${minute}.csv`;
      const prevUrl = `${INPE_BASE_URL}${prevFilename}`;
      
      console.log('Trying previous hour:', prevUrl);
      
      const prevResponse = await fetch(prevUrl);
      if (!prevResponse.ok) {
        throw new Error('Unable to fetch INPE data');
      }
      
      const csvText = await prevResponse.text();
      return NextResponse.json({ 
        success: true, 
        data: parseCSVData(csvText),
        source: prevFilename 
      });
    }
    
    const csvText = await response.text();
    return NextResponse.json({ 
      success: true, 
      data: parseCSVData(csvText),
      source: filename 
    });
    
  } catch (error) {
    console.error('Error fetching INPE data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch INPE data',
        data: []
      },
      { status: 500 }
    );
  }
}

function parseCSVData(csvText: string) {
  const lines = csvText.trim().split('\n');
  const parsedData: Array<{ lat: number; lon: number; satelite: string; dataHora: string }> = [];
  
  for (const line of lines) {
    const parts = line.split(',').map(part => part.trim());
    if (parts.length >= 4) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      const satelite = parts[2];
      const dataHora = parts[3];
      
      if (!isNaN(lat) && !isNaN(lon)) {
        parsedData.push({ lat, lon, satelite, dataHora });
      }
    }
  }
  
  return parsedData;
}
