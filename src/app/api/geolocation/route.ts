import { NextResponse } from 'next/server';
import { getCurrentPosition, reverseGeocode } from '@/services/geolocationService';

export async function GET(request: Request) {
  try {
    // HTML5 Geolocation API only works on client-side
    // This API route should be called from the browser
    const position = await getCurrentPosition();
    const address = await reverseGeocode(position.latitude, position.longitude);

    return NextResponse.json({
      latitude: position.latitude,
      longitude: position.longitude,
      accuracy: position.accuracy,
      city: address.city,
      region: address.region,
      country: address.country,
      formattedAddress: address.formattedAddress,
      timestamp: position.timestamp,
    });
  } catch (error) {
    console.error('Error getting geolocation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get geolocation',
        message: error instanceof Error ? error.message : 'HTML5 Geolocation API only works in browser environment',
        note: 'This API should be called from client-side code'
      },
      { status: 500 }
    );
  }
}