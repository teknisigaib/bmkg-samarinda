"use client";

import React, { useEffect, useState } from 'react';
import { 
  MapPin, RefreshCw, BookOpen, TrendingUp, TrendingDown, Minus,
  Wind,
  Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

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
  if (val <= THRESHOLDS.BAIK) return { text: "Baik", desc: "Udara bersih, nikmati aktivitas luar ruangan." };
  if (val <= THRESHOLDS.SEDANG) return { text: "Sedang", desc: "Kualitas udara dapat diterima, namun polusi sedang." };
  if (val <= THRESHOLDS.TIDAK_SEHAT) return { text: "Tidak Sehat", desc: "Gunakan masker jika beraktivitas di luar." };
  if (val <= THRESHOLDS.SANGAT_TIDAK_SEHAT) return { text: "Sangat Tidak Sehat", desc: "Hindari aktivitas fisik berat di luar ruangan." };
  return { text: "Berbahaya", desc: "Kualitas udara sangat buruk, tetap di dalam ruangan." };
};

export default function AirQualityView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({ history: [], current: 0, lastUpdate: "-" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/pm25');
        const json = await res.json();
        if (json.success) setData(json);
        else setError("Gagal memuat data server.");
      } catch (err) { setError("Koneksi timeout."); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // LOGIKA TREND
  const getTrendInfo = () => {
    const validHistory = data.history.filter((h: any) => h.pm25 !== null);
    
    if (validHistory.length < 2) return null;

    const current = validHistory[validHistory.length - 1].pm25;
    const previous = validHistory[validHistory.length - 2].pm25;
    const diff = current - previous;

    if (diff > 0) return { icon: TrendingUp, text: "Meningkat", color: "text-red-600", bg: "bg-red-50 border-red-100" };
    if (diff < 0) return { icon: TrendingDown, text: "Menurun", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };
    return { icon: Minus, text: "Stabil", color: "text-slate-500", bg: "bg-slate-50 border-slate-100" };
  };

  const statusInfo = getStatusInfo(data.current);
  const currentColor = getPm25Color(data.current);
  const trend = getTrendInfo();
  const TrendIcon = trend ? trend.icon : null;

  return (
    <div className="w-full min-h-screen text-slate-800 overflow-x-hidden">
      
      <section className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center text-center md:items-start md:text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Icon Container */}
          <div className="bg-white p-4 rounded-full shadow-sm w-fit shrink-0">
            <Wind className="w-8 h-8 text-emerald-600" />
          </div>
  
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">Kualitas Udara Kota Samarinda</h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed ">
              Monitoring konsentrasi Particulate Matter (<strong className="text-emerald-600">PM2.5</strong>) secara real-time di Stasiun Meteorologi APT Pranoto.
            </p>
            
            {/* Container Badge */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              
              {/* Badge Status (Online/Gangguan) */}
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
                 <span className="relative flex h-2.5 w-2.5">
                   {!loading && !error && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                   <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${!loading && !error ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                 </span>
                 {!loading && !error ? 'Status: Online' : 'Status: Connecting...'}
              </div>
          
              {/* Badge Lokasi */}
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  BMKG APT Pranoto
              </div>

              {/* Badge Waktu Update */}
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  Update: {data.lastUpdate}
              </div>

            </div>
          </div>
        </section>

      {/* CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mt-6 md:mt-8 space-y-6">

        {loading && (
           <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <span className="text-sm font-medium text-slate-500">Mengambil Data . . .</span>
           </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* GAUGE UTAMA */}
            <div className="bg-white rounded-[2rem] p-2 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[400px]">

                {/* Gauge SVG Container */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                    <circle cx="112" cy="112" r="96" stroke="#f1f5f9" strokeWidth="12" fill="transparent" strokeLinecap="round" />
                    <circle 
                      cx="112" cy="112" r="96" stroke={currentColor} strokeWidth="12" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 96}
                      strokeDashoffset={2 * Math.PI * 96 * (1 - Math.min(data.current, 250) / 250)} 
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out drop-shadow-lg"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl font-extrabold text-slate-800 tracking-tighter drop-shadow-sm">
                      {data.current}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest mt-2 bg-slate-50 px-2 py-1 rounded">
                      PM<sub>2.5</sub> µg/m³
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                    {statusInfo.text}
                </h2>
                {/* INDIKATOR TREN */}
                {trend && TrendIcon && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-4 ${trend.bg} ${trend.color}`}>
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span>Tren: {trend.text}</span>
                    </div>
                )}
                <p className="text-slate-500 text-sm leading-relaxed max-w-[200px] sm:max-w-xs mx-auto">
                    {statusInfo.desc}
                </p>
            </div>

            {/* GRAFIK */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-5 sm:p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col min-h-[400px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Data 24 Jam Terakhir</h3>
                  <p className="text-sm text-slate-400">Riwayat konsentrasi PM2.5 per jam</p>
                </div>
              </div>

              <div className="w-full h-[300px] min-w-0 relative">
                 {data.history.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic">
                        Belum ada data riwayat tersedia
                    </div>
                 ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.history} margin={{ top: 10, right: 0, left: -10, bottom: 0 }} barCategoryGap="20%">
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
                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                            dy={10} 
                            interval="preserveStartEnd"
                            minTickGap={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                            label={{ value: 'µg/m³', angle: -90, position: 'insideLeft', offset: 0, fontSize: 10, fill: '#cbd5e1' }}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc', radius: 8 }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                const val = payload[0].value as number;
                                if (val === null) return null;
                                const color = getPm25Color(val);
                                return (
                                    <div className="bg-white/95 backdrop-blur px-3 py-2 border border-slate-100 shadow-xl rounded-md text-xs z-50">
                                    <p className="font-bold text-slate-700 mb-0.5">Jam {label}:00</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{background: color}}></div>
                                        <span className=" font-bold text-sm">{val}</span>
                                    </div>
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="pm25" radius={[4, 4, 4, 4]}>
                        {data.history.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                 )}
              </div>
            </div>

            {/*  LEGEND */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Panduan Indeks Kualitas Udara</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                    {[
                        { label: "Baik", range: "0 - 15.5 µg/m³", color: COLORS.BAIK, bg: "bg-emerald-50 text-emerald-700" },
                        { label: "Sedang", range: "15.6 - 55.4 µg/m³", color: COLORS.SEDANG, bg: "bg-blue-50 text-blue-700" },
                        { label: "Tdk Sehat", range: "55.5 - 150.4 µg/m³", color: COLORS.TIDAK_SEHAT, bg: "bg-amber-50 text-amber-700" },
                        { label: "Sangat Tdk Sehat", range: "150.5 - 250.4 µg/m³", color: COLORS.SANGAT_TS, bg: "bg-red-50 text-red-700" },
                        { label: "Berbahaya", range: "> 250.5 µg/m³", color: COLORS.BERBAHAYA, bg: "bg-slate-100 text-slate-700" },
                    ].map((item, idx) => (
                        <div key={idx} className={`rounded-xl p-3 text-center border border-transparent hover:border-slate-200 transition-colors ${item.bg}`}>
                            <div className="w-4 h-4 rounded-md mx-auto mb-2" style={{ backgroundColor: item.color }}></div>
                            <div className="font-bold text-sm mb-0.5 whitespace-nowrap">{item.label}</div>
                            <div className="text-[10px] opacity-80">{item.range}</div>
                        </div>
                    ))}
                </div>

                {/*  DESKRIPSI PM2.5 */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-5 items-start mt-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800 text-sm mb-2">Apa itu PM2.5?</h5>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
                            <strong>PM2.5 (Particulate Matter 2.5)</strong> adalah partikel udara yang berukuran sangat kecil (kurang dari 2.5 mikrometer). Ukuran ini kira-kira 3% dari diameter rambut manusia. Karena sangat halus, partikel ini dapat menembus sistem pernapasan hingga ke paru-paru bagian dalam dan bahkan masuk ke aliran darah. Paparan jangka panjang dapat berisiko bagi kesehatan jantung dan pernapasan.
                        </p>
                    </div>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}