"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import LocationSearch from '@/components/component-cuaca/prakiraan-cuaca/LocationSearch';
import CurrentWeather from '@/components/component-cuaca/prakiraan-cuaca/CurrentWeather';
import WeatherDetails from '@/components/component-cuaca/prakiraan-cuaca/WeatherDetails';
import SubRegionGrid from '@/components/component-cuaca/prakiraan-cuaca/SubRegionGrid';
import ForecastTable from '@/components/component-cuaca/prakiraan-cuaca/ForecastTable';
import { fetchBMKGData } from '@/lib/weather-service';
import { WeatherData } from '@/lib/types';

export default function Home() {
  // ID default ke '64' (Kalimantan Timur)
  const [currentLocationId, setCurrentLocationId] = useState('64'); 
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Efek untuk mengubah Judul Tab Browser
  useEffect(() => {
    if (weather) {
      document.title = `Cuaca ${weather.location} | ${weather.condition} ${weather.temp}°`;
    } else {
      document.title = "CuacaKita - Info Cuaca Terkini";
    }
  }, [weather]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchBMKGData(currentLocationId);
      if (data) {
        setWeather(data);
      }
      setLoading(false);
    }
    loadData();
  }, [currentLocationId]);

  const handleLocationChange = (id: string) => {
    setCurrentLocationId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center overflow-x-hidden">
        <div className="flex flex-col items-center gap-2 text-slate-400">
           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
           <p>Memuat data cuaca...</p>
        </div>
      </div>
    );
  }

  if (!weather) return <div className="p-10 text-center">Gagal memuat data.</div>;

  return (
    <main className="min-h-screen  pb-20 selection:bg-blue-100">
      
      <div className="w-full mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
           <div className="order-2 md:order-1 flex-1 overflow-hidden">
             
             {/* Breadcrumb Dinamis */}
             <div className="text-sm text-slate-400 flex items-center gap-1">
                {weather.parentLocation && (
                  <>
                    <span className="hover:text-slate-600 cursor-pointer" onClick={() => {
                    }}>
                      {weather.parentLocation}
                    </span>
                    <span>&gt;</span>
                  </>
                )}
                <span className="font-bold text-blue-600">{weather.location}</span>
             </div>

           </div>
           <div className="order-1 md:order-2 w-full md:w-auto md:min-w-[320px]">
             <LocationSearch onSelectLocation={handleLocationChange} />
           </div>
        </div>
        
        <header>
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-2 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            {weather.level === 'province' ? 'Provinsi' : 
             weather.level === 'city' ? 'Kota/Kab' : 
             weather.level === 'district' ? 'Kecamatan' : 'Desa/Kel'}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {weather.location}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            {weather.timestamp}
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CurrentWeather data={weather} />
          <WeatherDetails data={weather} />
        </section>

        {/* Logic Grid Sub-Region:
            Jika level = Desa (village), jangan tampilkan grid.
            Jika level = Provinsi/Kota/Kecamatan, tampilkan grid anaknya.
        */}
        {weather.subRegions && weather.subRegions.length > 0 && weather.level !== 'village' && (
          <section>
             <SubRegionGrid 
               title={`Wilayah di ${weather.location}`} 
               regions={weather.subRegions as any} 
               onRegionClick={handleLocationChange} 
             />
          </section>
        )}

        {weather.tableData && (
          <section>
             <ForecastTable data={weather.tableData} />
          </section>
        )}

      </div>
    </main>
  );
}