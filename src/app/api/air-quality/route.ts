import { NextResponse } from 'next/server';
import { getAirQualityData, getAQICategory } from '@/services/openMeteoService';
import { AirQualityData } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    const latitude = lat ? parseFloat(lat) : -23.5505; // Default: São Paulo
    const longitude = lon ? parseFloat(lon) : -46.6333;

    const data = await getAirQualityData(latitude, longitude);

    // Use current data instead of hourly data for more accurate real-time values
    const airQualityData: AirQualityData = {
      aqi: Math.round(data.current.us_aqi),
      pm25: Math.round(data.current.pm2_5 * 10) / 10,
      pm10: Math.round(data.current.pm10 * 10) / 10,
      o3: Math.round(data.current.ozone * 10) / 10,
      no2: Math.round(data.current.nitrogen_dioxide * 10) / 10,
      so2: Math.round(data.current.sulphur_dioxide * 10) / 10,
      co: Math.round(data.current.carbon_monoxide * 100) / 100,
      category: getAQICategory(Math.round(data.current.us_aqi)),
      timestamp: new Date(data.current.time),
    };

    return NextResponse.json(airQualityData);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data' },
      { status: 500 }
    );
  }
}