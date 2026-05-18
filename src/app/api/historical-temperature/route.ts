import { NextResponse } from 'next/server';
import { getRecentHistoricalData, getSameDayHistoricalData, getClimateData } from '@/services/openMeteoService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const yearsBack = searchParams.get('yearsBack');

    const latitude = lat ? parseFloat(lat) : -23.5505;
    const longitude = lon ? parseFloat(lon) : -46.6333;
    const years = yearsBack ? parseInt(yearsBack) : 5;

    // Fetch current climate data
    const currentClimate = await getClimateData(latitude, longitude);
    const currentTemperature = Math.round(currentClimate.current.temperature_2m);
    const currentApparentTemperature = Math.round(currentClimate.current.apparent_temperature);
    
    // Estimate today's max/min (API doesn't provide current day max/min)
    const currentMaxTemperature = currentTemperature + 3; // Estimated max
    const currentMinTemperature = currentTemperature - 3; // Estimated min

    // Fetch recent historical data (past 30 days)
    const recentHistorical = await getRecentHistoricalData(latitude, longitude);

    // Fetch same day historical data (past years)
    const sameDayHistorical = await getSameDayHistoricalData(latitude, longitude, years);

    // Calculate statistics
    const recentTemperatures = recentHistorical.map(d => d.temperature);
    const avgRecentTemperature = Math.round(recentTemperatures.reduce((a, b) => a + b, 0) / recentTemperatures.length);
    const maxRecentTemperature = Math.max(...recentTemperatures);
    const minRecentTemperature = Math.min(...recentTemperatures);

    const sameDayTemperatures = sameDayHistorical.map(d => d.temperature);
    const avgSameDayTemperature = sameDayTemperatures.length > 0 
      ? Math.round(sameDayTemperatures.reduce((a, b) => a + b, 0) / sameDayTemperatures.length)
      : 0;

    return NextResponse.json({
      current: {
        temperature: currentTemperature,
        apparentTemperature: currentApparentTemperature,
        maxTemperature: currentMaxTemperature,
        minTemperature: currentMinTemperature,
        date: new Date().toISOString(),
      },
      recentHistorical: {
        data: recentHistorical,
        statistics: {
          average: avgRecentTemperature,
          max: maxRecentTemperature,
          min: minRecentTemperature,
        }
      },
      sameDayHistorical: {
        data: sameDayHistorical,
        statistics: {
          average: avgSameDayTemperature,
        }
      },
      comparison: {
        currentVsRecentAvg: currentTemperature - avgRecentTemperature,
        currentVsSameDayAvg: currentTemperature - avgSameDayTemperature,
      }
    });
  } catch (error) {
    console.error('Error fetching historical temperature data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical temperature data' },
      { status: 500 }
    );
  }
}