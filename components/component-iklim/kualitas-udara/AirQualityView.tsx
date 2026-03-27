"use client";

import React from 'react';
import { 
  TrendingUp, TrendingDown, Minus 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// --- KONFIGURASI WARNA & BATAS ---
const THRESHOLDS = { BAIK: 15.5, SEDANG: 55.4, TIDAK_SEHAT: 150.4, SANGAT_TIDAK_SEHAT: 250.4 };

const COLORS = { 
  BAIK: "#10b981",       
  SEDANG: "#3b82f6",     
  TIDAK_SEHAT: "#f59e0b",
  SANGAT_TS: "#ef4444",  
  BERBAHAYA: "#1e293b"   
};

const getPm25Color = (val: number) => {
  if (val <= THRESHOLDS.BAIK) return COLORS.BAIK;
  if (val <= THRESHOLDS.SEDANG) return COLORS.SEDANG;
  if (val <= THRESHOLDS.TIDAK_SEHAT) return COLORS.TIDAK_SEHAT;
  if (val <= THRESHOLDS.SANGAT_TIDAK_SEHAT) return COLORS.SANGAT_TS;
  return COLORS.BERBAHAYA;
};

const getStatusInfo = (val: number) => {
  if (val <= THRESHOLDS.BAIK) return { text: "Baik", desc: "Udara bersih, nikmati aktivitas luar ruangan tanpa ragu." };
  if (val <= THRESHOLDS.SEDANG) return { text: "Sedang", desc: "Kualitas udara dapat diterima, namun polusi mulai terasa." };
  if (val <= THRESHOLDS.TIDAK_SEHAT) return { text: "Tidak Sehat", desc: "Gunakan masker dan kurangi durasi aktivitas luar ruangan." };
  if (val <= THRESHOLDS.SANGAT_TIDAK_SEHAT) return { text: "Sangat Tidak Sehat", desc: "Hindari seluruh aktivitas fisik berat di luar ruangan." };
  return { text: "Berbahaya", desc: "Kualitas udara sangat buruk. Tetap di dalam ruangan tertutup." };
};

// COMPONENT UTAMA
export default function AirQualityView({ initialData }: { initialData: any }) {
  
  const data = initialData;
  const isError = !data.success && data.history.length === 0;

  // LOGIKA TREND
  const getTrendInfo = () => {
    if (!data.history || data.history.length < 2) return null;

    const validHistory = data.history.filter((h: any) => h.pm25 !== null);
    if (validHistory.length < 2) return null;

    const current = validHistory[validHistory.length - 1].pm25;
    const previous = validHistory[validHistory.length - 2].pm25;
    const diff = current - previous;

    if (diff > 0) return { icon: TrendingUp, text: "Meningkat", color: "text-red-600", bg: "bg-red-50 border-red-100" };
    if (diff < 0) return { icon: TrendingDown, text: "Menurun", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };
    return { icon: Minus, text: "Stabil", color: "text-slate-500", bg: "bg-slate-50 border-slate-100" };
  };

  const currentVal = data.current || 0;
  const statusInfo = getStatusInfo(currentVal);
  const currentColor = getPm25Color(currentVal);
  const trend = getTrendInfo();
  const TrendIcon = trend ? trend.icon : null;

  return (
    <div className="w-full text-slate-800">
      
      {/* TAMPILAN JIKA SENSOR MATI/ERROR */}
      {isError && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-800 font-semibold shadow-sm">
             Sensor PM2.5 saat ini sedang offline atau dalam pemeliharaan. Data tidak dapat ditampilkan.
          </div>
      )}

      {/* CONTENT WRAPPER */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${isError ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
            
            {/* GAUGE UTAMA (KIRI) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm lg:min-h-[420px]">
                
                {/* Waktu Terakhir Dihapus dari sini karena sudah dipindah ke Header (page.tsx) */}

                <div className="relative w-56 h-56 sm:w-64 sm:h-64 mt-2 mb-6 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                    {/* Lingkaran Dasar */}
                    <circle cx="112" cy="112" r="96" stroke="#f1f5f9" strokeWidth="14" fill="transparent" strokeLinecap="round" />
                    {/* Lingkaran Nilai Aktif */}
                    <circle 
                      cx="112" cy="112" r="96" stroke={currentColor} strokeWidth="14" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 96}
                      strokeDashoffset={2 * Math.PI * 96 * (1 - Math.min(currentVal, 250) / 250)} 
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out drop-shadow-md"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl sm:text-7xl font-black text-slate-800 tracking-tighter drop-shadow-sm">
                      {currentVal}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-widest mt-2 uppercase border border-slate-100 bg-slate-50 px-3 py-1 rounded-lg">
                      µg/m³
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight" style={{ color: currentColor }}>
                    {statusInfo.text}
                </h2>

                {trend && TrendIcon && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold border mb-4 shadow-sm ${trend.bg} ${trend.color}`}>
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span>Tren: {trend.text}</span>
                    </div>
                )}
                
                <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
                    {statusInfo.desc}
                </p>
            </div>

            {/* GRAFIK RIWAYAT (KANAN) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 flex flex-col min-h-[420px] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Data 24 Jam Terakhir</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Riwayat fluktuasi konsentrasi PM2.5 per jam</p>
                </div>
              </div>

              <div className="w-full flex-grow min-h-[250px] relative">
                 {(!data.history || data.history.length === 0) ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
                        <span className="text-xs font-bold uppercase tracking-widest">Belum ada riwayat tersedia</span>
                    </div>
                 ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.history} margin={{ top: 10, right: 0, left: -25, bottom: 0 }} barCategoryGap="20%">
                        <defs>
                        {data.history.map((entry: any, index: number) => {
                            const color = entry.pm25 !== null ? getPm25Color(entry.pm25) : 'transparent';
                            return (
                                <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={1}/>
                                <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                                </linearGradient>
                            );
                        })}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                            dy={10} 
                            interval="preserveStartEnd"
                            minTickGap={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                            label={{ value: 'Konsentrasi (µg/m³)', angle: -90, position: 'insideLeft', offset: 25, fontSize: 10, fill: '#cbd5e1', fontWeight: 700 }}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc', radius: 8 }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                const val = payload[0].value as number;
                                if (val === null) return null;
                                const color = getPm25Color(val);
                                return (
                                    <div className="bg-white/95 backdrop-blur-sm px-4 py-3 border border-slate-200 shadow-xl rounded-xl z-50 min-w-[120px]">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Pukul {label}</p>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{background: color}}></div>
                                            <span className="font-black text-lg text-slate-800">{val} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-0.5">µg/m³</span></span>
                                        </div>
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="pm25" radius={[6, 6, 6, 6]}>
                        {data.history.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                 )}
              </div>
            </div>

            {/* LEGEND (BAWAH) */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h4 className="text-[12px] font-bold text-slate-400 mb-6 text-center">Panduan Klasifikasi Indeks Kualitas Udara</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: "Baik", range: "0 - 15.5", color: COLORS.BAIK, bg: "bg-emerald-50 border-emerald-100" },
                        { label: "Sedang", range: "15.6 - 55.4", color: COLORS.SEDANG, bg: "bg-blue-50 border-blue-100" },
                        { label: "Tidak Sehat", range: "55.5 - 150.4", color: COLORS.TIDAK_SEHAT, bg: "bg-amber-50 border-amber-100" },
                        { label: "Sangat Tdk Sehat", range: "150.5 - 250.4", color: COLORS.SANGAT_TS, bg: "bg-red-50 border-red-100" },
                        { label: "Berbahaya", range: "> 250.5", color: COLORS.BERBAHAYA, bg: "bg-slate-100 border-slate-200" },
                    ].map((item, idx) => (
                        <div key={idx} className={`rounded-md p-4 text-center border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${item.bg}`}>
                            <div className="w-6 h-6 rounded-md mx-auto mb-3 shadow-sm border border-white" style={{ backgroundColor: item.color }}></div>
                            <div className="font-bold text-sm text-slate-600 mb-1">{item.label}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.range}</div>
                        </div>
                    ))}
                </div>
            </div>

      </div>
    </div>
  );
}