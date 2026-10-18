"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, CalendarDays, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, ReferenceArea 
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

export default function AirQualityView({ initialData, dailyData }: { initialData: any, dailyData?: any }) {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');
  const [dailyMetric, setDailyMetric] = useState<'average' | 'min' | 'max'>('average');
  
  const data = initialData;
  const isError = !data?.success && (!data?.history || data?.history.length === 0);
  const dailyHistory = dailyData?.data || [];

  const getTrendInfo = () => {
    if (!data?.history || data.history.length < 2) return null;
    const validHistory = data.history.filter((h: any) => h.pm25 !== null);
    if (validHistory.length < 2) return null;

    const current = validHistory[validHistory.length - 1].pm25;
    const previous = validHistory[validHistory.length - 2].pm25;
    const diff = current - previous;

    if (diff > 0) return { icon: TrendingUp, text: "Meningkat", color: "text-red-600", bg: "bg-red-50 border-red-100" };
    if (diff < 0) return { icon: TrendingDown, text: "Menurun", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };
    return { icon: Minus, text: "Stabil", color: "text-slate-500", bg: "bg-slate-50 border-slate-100" };
  };

  const currentVal = data?.current || 0;
  const statusInfo = getStatusInfo(currentVal);
  const currentColor = getPm25Color(currentVal);
  const trend = getTrendInfo();
  const TrendIcon = trend ? trend.icon : null;

  const getActiveDataKey = () => {
    if (dailyMetric === 'min') return 'min_pm25';
    if (dailyMetric === 'max') return 'max_pm25';
    return 'average_pm25';
  };

  const activeDataKey = getActiveDataKey();

  return (
    <div className="w-full text-slate-800">
      {isError && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-800 font-semibold shadow-sm">
             Sensor PM2.5 saat ini sedang offline atau dalam pemeliharaan. Data tidak dapat ditampilkan.
          </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${isError ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
            
            {/* GAUGE UTAMA (KIRI) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm lg:min-h-[420px]">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 mt-2 mb-6 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                    <circle cx="112" cy="112" r="96" stroke="#f1f5f9" strokeWidth="14" fill="transparent" strokeLinecap="round" />
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
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-widest mt-2 border border-slate-100 bg-slate-50 px-3 py-1 rounded-lg">
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
              
              {/* HEADER GRAFIK (Rata Tengah di Mobile, Kiri-Kanan di Desktop) */}
              <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 text-center sm:text-left w-full sm:w-auto">
                  {activeTab === 'hourly' ? 'Data 24 Jam Terakhir' : 'Rekap 14 Hari Terakhir'}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                  {/* TOMBOL FILTER (Min/Max/Rata-rata) */}
                  {activeTab === 'daily' && dailyHistory.length > 0 && (
                    <div className="flex gap-2">
                      {['min', 'average', 'max'].map((metric) => (
                        <button 
                          key={metric}
                          onClick={() => setDailyMetric(metric as any)}
                          className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${dailyMetric === metric ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {metric === 'average' ? 'Rata-rata' : metric === 'min' ? 'Min' : 'Max'}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* TAB SWITCHER (24 Jam / 14 Hari) */}
                  <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button 
                      onClick={() => setActiveTab('hourly')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === 'hourly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Clock className="w-3.5 h-3.5" /> 24 Jam
                    </button>
                    <button 
                      onClick={() => setActiveTab('daily')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <CalendarDays className="w-3.5 h-3.5" /> 14 Hari
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full flex-grow min-h-[250px] relative">
                 
                 {/* ================= TAB HOURLY ================= */}
                 {activeTab === 'hourly' && (
                   (!data?.history || data.history.length === 0) ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                          <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
                          <span className="text-xs font-bold tracking-widest">Belum ada riwayat tersedia</span>
                      </div>
                   ) : (
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barCategoryGap="20%">
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
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} interval="preserveStartEnd" minTickGap={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <Tooltip 
                              cursor={{ fill: '#f8fafc', radius: 8 }}
                              content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                  const val = payload[0].value as number;
                                  if (val === null) return null;
                                  const color = getPm25Color(val);
                                  return (
                                      <div className="bg-white/95 backdrop-blur-sm px-3 py-2 border border-slate-200 shadow-lg rounded-xl z-50">
                                          <p className="text-[10px] font-bold text-slate-400 mb-1">Pukul {label}</p>
                                          <div className="flex items-center gap-2">
                                              <div className="w-2.5 h-2.5 rounded-full" style={{background: color}}></div>
                                              <span className="font-black text-slate-800">{val} <span className="text-[10px] font-normal">µg/m³</span></span>
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
                   )
                 )}

                 {/* ================= TAB DAILY ================= */}
                 {activeTab === 'daily' && (
                   dailyHistory.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                          <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
                          <span className="text-xs font-bold tracking-widest">Data harian belum tersedia</span>
                      </div>
                   ) : (
                      <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>

                          {/* ZONA WARNA DIMASUKKAN LANGSUNG KE SINI BIAR GAK ERROR */}
                          <ReferenceArea y1={0} y2={THRESHOLDS.BAIK} fill={COLORS.BAIK} fillOpacity={0.15} ifOverflow="hidden" />
                          <ReferenceArea y1={THRESHOLDS.BAIK} y2={THRESHOLDS.SEDANG} fill={COLORS.SEDANG} fillOpacity={0.15} ifOverflow="hidden" />
                          <ReferenceArea y1={THRESHOLDS.SEDANG} y2={THRESHOLDS.TIDAK_SEHAT} fill={COLORS.TIDAK_SEHAT} fillOpacity={0.15} ifOverflow="hidden" />
                          <ReferenceArea y1={THRESHOLDS.TIDAK_SEHAT} y2={THRESHOLDS.SANGAT_TIDAK_SEHAT} fill={COLORS.SANGAT_TS} fillOpacity={0.15} ifOverflow="hidden" />
                          <ReferenceArea y1={THRESHOLDS.SANGAT_TIDAK_SEHAT} y2={1000} fill={COLORS.BERBAHAYA} fillOpacity={0.12} ifOverflow="hidden" />

                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} minTickGap={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <Tooltip 
                              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
                              content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  const val = data[activeDataKey];
                                  const color = getPm25Color(val);
                                  return (
                                      <div className="bg-white/95 backdrop-blur-sm px-3 py-2 border border-slate-200 shadow-lg rounded-xl z-50">
                                          <p className="text-[10px] font-bold text-slate-400 mb-1">{label}</p>
                                          <div className="flex items-center gap-2 mb-1">
                                              <div className="w-2.5 h-2.5 rounded-full" style={{background: color}}></div>
                                              <span className="font-black text-slate-800 text-sm">{val} <span className="text-[10px] font-normal">µg/m³</span></span>
                                          </div>
                                          <div className="text-[9px] text-slate-500 font-medium">
                                            {dailyMetric !== 'min' && <span className="mr-2">Min: {data.min_pm25}</span>}
                                            {dailyMetric !== 'average' && <span className="mr-2">Rata: {data.average_pm25}</span>}
                                            {dailyMetric !== 'max' && <span>Max: {data.max_pm25}</span>}
                                          </div>
                                      </div>
                                  );
                                  }
                                  return null;
                              }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey={activeDataKey} 
                            stroke="#cbd5e1" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorDaily)" 
                            dot={(props: any) => {
                              const { cx, cy, payload, index } = props;
                              const val = payload[activeDataKey];
                              const dotColor = getPm25Color(val);
                              return (
                                <circle 
                                  key={`dot-${index}`} cx={cx} cy={cy} r={5} 
                                  stroke="#fff" strokeWidth={2} fill={dotColor} 
                                  className="drop-shadow-sm transition-all duration-300"
                                />
                              );
                            }}
                            activeDot={false}
                          />
                      </AreaChart>
                      </ResponsiveContainer>
                   )
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