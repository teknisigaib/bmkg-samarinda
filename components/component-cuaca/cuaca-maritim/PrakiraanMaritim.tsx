"use client";

import { useEffect, useState } from "react";
import WeatherIcon from "../WeatherIcon";
import { Waves, Wind, AlertTriangle } from "lucide-react";

interface PrakiraanProps {
  id: string;
  nama: string;
}

interface PrakiraanItem {
  time_desc: string;
  weather: string;
  weather_desc: string;
  wave_cat: string;
  wave_desc: string;
  wind_from: string;
  wind_to: string;
  wind_speed_min: number;
  wind_speed_max: number;
  warning_desc: string;
}

export default function PrakiraanMaritim({ id, nama }: PrakiraanProps) {
  const [prakiraan, setPrakiraan] = useState<PrakiraanItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/maritim/${id}`);
        if (!response.ok) throw new Error("Gagal memuat data.");
        const data = await response.json();
        setPrakiraan(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="w-full  mx-auto text-center bg-gray-50 text-gray-500 rounded-lg">Memuat data untuk {nama}...</div>;
  }

  if (error || prakiraan.length === 0) {
    return (
      <div className="w-full  mx-auto text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg shadow">
        Data untuk {nama} tidak tersedia atau gagal dimuat.
      </div>
    );
  }
  
  const selectedData = prakiraan[selectedIndex];

  return (
    <div className="w-full mx-auto bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="font-bold text-xl text-gray-800 mb-2">{nama}</h2>
      
      <div className="flex space-x-1 mb-4 border-b border-gray-300/60">
        {prakiraan.map((item, index) => (
          <button
            key={item.time_desc || index}
            onClick={() => setSelectedIndex(index)}
            className={`px-3 py-2 text-sm font-medium transition-colors duration-200 -mb-px ${selectedIndex === index ? 'border-b-2 border-blue-600 text-blue-700' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
          >
            {item.time_desc}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
        <div className="md:col-span-1 flex flex-col items-center text-center">
            <WeatherIcon condition={selectedData.weather} className="w-24 h-24" />
            <p className="text-xl font-semibold mt-2">{selectedData.weather}</p>
        </div>
        <div className="md:col-span-2 w-full space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg"><Waves className="w-8 h-8 text-cyan-600 flex-shrink-0" /><div><p className="text-sm text-slate-500">Gelombang</p><p className="text-lg font-bold">{selectedData.wave_desc}</p><p className="text-xs text-slate-500">({selectedData.wave_cat})</p></div></div>
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg"><Wind className="w-8 h-8 text-slate-500 flex-shrink-0" /><div><p className="text-sm text-slate-500">Angin</p><p className="text-lg font-bold">{selectedData.wind_speed_min}-{selectedData.wind_speed_max} knot</p><p className="text-xs text-slate-500">{selectedData.wind_from} - {selectedData.wind_to}</p></div></div>
            </div>
            
            {/* PERINGATAN */}
            {selectedData.warning_desc && selectedData.warning_desc !== "NIL" && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-300/50 text-red-800 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Peringatan</p>
                  <p className="text-xs">{selectedData.warning_desc}</p>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-700 bg-gray-100/80 p-3 rounded-md">{selectedData.weather_desc}</div>
        </div>
      </div>
    </div>
  );
}