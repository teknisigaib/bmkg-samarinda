import { useState, useEffect } from 'react';
import { AirportData } from '@/components/component-cuaca/penerbangan/AirportDetailPanel';

// Daftar ICAO Target
const AIRPORT_LIST = [
  "WALS", "WALL", "WAQT", "WIII", "WARR", 
  "WAOO", "WAHI", "WAAA", "WADD", "WAQL", "WALE", "WAQC"
];

export function useAirportWeather() {
  const [data, setData] = useState<AirportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        // Fetch semua bandara secara paralel ke API lokal kita
        const promises = AIRPORT_LIST.map(icao => 
          fetch(`/api/aviation-weather?icao=${icao}`).then(res => res.json())
        );

        const results = await Promise.all(promises);
        
        // Filter yang gagal (jika ada)
        const validResults = results.filter(r => !r.error);
        setData(validResults);
      } catch (error) {
        console.error("Failed to load airport data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();

    // Refresh setiap 5 menit
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading };
}