import { NextResponse } from 'next/server';
import { getClimateData, getWeatherDescription, getWindDirection } from '@/services/openMeteoService';
import { ClimateData } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    const latitude = lat ? parseFloat(lat) : -23.5505; // Default: São Paulo
    const longitude = lon ? parseFloat(lon) : -46.6333;

    const data = await getClimateData(latitude, longitude);

    // Convert Open-Meteo data to our ClimateData format
    const climateData: ClimateData = {
      temperature: Math.round(data.current.temperature_2m),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: getWindDirection(data.current.wind_direction_10m),
      pressure: Math.round(data.current.surface_pressure),
      visibility: data.hourly.visibility[0] / 1000, // Convert m to km
      uvIndex: Math.round(data.daily.uv_index_max[0]),
      condition: getWeatherDescription(data.current.weather_code),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      timestamp: new Date(data.current.time),
    };

    return NextResponse.json(climateData);
  } catch (error) {
    console.error('Error fetching climate data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch climate data' },
      { status: 500 }
    );
  }
}