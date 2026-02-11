import { NextResponse } from 'next/server';
import { MAHAKAM_LOCATIONS } from '@/lib/mahakam-data';
import { fetchBMKGData } from '@/lib/weather-service';

export async function GET() {
  try {
    const promises = MAHAKAM_LOCATIONS.map(async (loc) => {
      const weatherData = await fetchBMKGData(loc.bmkgId);

      if (!weatherData) return { ...loc, weather: 'N/A', temp: 0 };

      return {
        ...loc,
        weather: weatherData.condition, 
        temp: weatherData.temp,         
        iconUrl: weatherData.subRegions.length > 0 
                    ? weatherData.subRegions[0].icon 
                    : "", 
        windSpeed: weatherData.windSpeed,
        humidity: weatherData.humidity,
        feelsLike: weatherData.feelsLike
      };
    });

    const results = await Promise.all(promises);

    return NextResponse.json({ 
        success: true, 
        data: results,
        generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching Mahakam weather:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch weather data" }, { status: 500 });
  }
}