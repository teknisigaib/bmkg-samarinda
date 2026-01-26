import React from 'react';
import { Wind, Droplets, Gauge, Eye } from 'lucide-react';
import { WeatherData } from '@/lib/types';

export default function WeatherDetails({ data }: { data: WeatherData }) {
  const details = [
    { icon: Wind, label: "Angin", value: `${data.windSpeed} km/j`, color: "text-slate-400" },
    { icon: Droplets, label: "Kelembapan", value: `${data.humidity}%`, color: "text-blue-400" },
    { icon: Gauge, label: "Tekanan", value: `${data.pressure} hPa`, color: "text-slate-400" },
    { icon: Eye, label: "Visibilitas", value: `${data.visibility} km`, color: "text-slate-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 h-full content-start">
      {details.map((item, idx) => (
        // Saya menambahkan 'h-full' agar kotak-kotak ini meregang mengisi tinggi yang tersedia
        <div key={idx} className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm flex flex-col justify-center hover:border-blue-200 transition-colors h-full min-h-[140px]">
          <item.icon className={`w-6 h-6 ${item.color} mb-auto`} strokeWidth={2} />
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
            <div className="font-bold text-slate-800 text-xl mt-1">{item.value}</div>
          </div>
        </div>
      ))}
      
      {/* Bagian Kualitas Udara DIHAPUS dari sini */}
    </div>
  );
}