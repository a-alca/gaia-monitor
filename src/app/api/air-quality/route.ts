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

    // Get current hour index (most recent data)
    const currentHourIndex = data.hourly.time.length - 1;

    // Convert Open-Meteo data to our AirQualityData format
    const airQualityData: AirQualityData = {
      aqi: Math.round(data.hourly.us_aqi[currentHourIndex]),
      pm25: Math.round(data.hourly.pm2_5[currentHourIndex] * 10) / 10,
      pm10: Math.round(data.hourly.pm10[currentHourIndex] * 10) / 10,
      o3: Math.round(data.hourly.ozone[currentHourIndex] * 10) / 10,
      no2: Math.round(data.hourly.nitrogen_dioxide[currentHourIndex] * 10) / 10,
      so2: Math.round(data.hourly.sulphur_dioxide[currentHourIndex] * 10) / 10,
      co: Math.round(data.hourly.carbon_monoxide[currentHourIndex] * 100) / 100,
      category: getAQICategory(Math.round(data.hourly.us_aqi[currentHourIndex])),
      timestamp: new Date(data.hourly.time[currentHourIndex]),
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