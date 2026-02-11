"use client";

import { BarChart3, Phone, ShieldAlert } from "lucide-react";

interface StatProps {
  trend: { date: string; count: number }[];
}

export default function KarhutlaStats({ trend }: StatProps) {
  // Cari nilai max untuk skala grafik
  const maxVal = Math.max(...trend.map(t => t.count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* GRAFIK TREN*/}
      <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <BarChart3 className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-gray-800">Tren Titik Panas (7 Hari Terakhir)</h3>
                <p className="text-xs text-gray-500">Jumlah hotspot terdeteksi per hari.</p>
            </div>
        </div>

        {/* Chart Container */}
        <div className="flex items-end justify-between gap-2 h-40 mt-auto px-2">
            {trend.map((item, idx) => {
                const dateLabel = new Date(item.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });
                const MAX_BAR_HEIGHT = 100;
                const barHeight = (item.count / maxVal) * MAX_BAR_HEIGHT;
                
                return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end">
                        {/* Tooltip Count */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-blue-600 mb-1">
                            {item.count}
                        </div>
                        {/* The Bar */}
                        <div 
                            className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 relative ${item.count > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-100'}`}
                            style={{ height: `${barHeight}px`, minHeight: '4px' }}
                        >
                        </div>
                        {/* Date Label */}
                        <div className="text-[10px] text-gray-400 font-medium text-center">{dateLabel}</div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* HIMBAUAN  */}
      <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col justify-between">
         <div>
            <div className="flex items-center gap-2 mb-3 text-red-700">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold">Himbauan Keselamatan</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4 mb-4">
                <li>Hindari membakar sampah atau lahan saat cuaca panas.</li>
                <li>Segera laporkan jika melihat kepulan asap mencurigakan.</li>
                <li>Gunakan masker jika kualitas udara memburuk (asap).</li>
            </ul>
         </div>

         <div className="bg-white p-3 rounded-xl border border-red-100 flex items-center gap-3">
             <div className="bg-red-600 text-white p-2 rounded-full">
                 <Phone className="w-4 h-4" />
             </div>
             <div>
                 <div className="text-[10px] uppercase font-bold text-gray-400">Call Center Karhutla</div>
                 <div className="font-bold text-lg text-gray-900">112</div>
             </div>
         </div>
      </div>

    </div>
  );
}