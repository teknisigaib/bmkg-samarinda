"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Thermometer, Droplets, Wind, Sun, Gauge, 
  Clock, CloudRain, Activity, Compass, Info, HelpCircle, X, AlertTriangle
} from "lucide-react";
import { AwsSnapshotData, AwsApiData } from "@/lib/aws-types";
import { getStatus, transformAwsData } from "@/lib/aws-utils";

// KOMPONEN SKELETON (LOADING STATE)
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-50 pb-10 animate-pulse">
    <div className="bg-white border-b border-slate-200 h-16 mb-8"></div>
    <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Kolom 1 */}
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 h-48 rounded-xl"></div>
        <div className="bg-slate-200 h-48 rounded-xl"></div>
        <div className="bg-slate-200 h-40 rounded-xl"></div>
      </div>
      {/* Kolom 2 */}
      <div className="bg-slate-200 h-[600px] rounded-xl"></div>
      {/* Kolom 3 */}
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 h-48 rounded-xl"></div>
        <div className="bg-slate-200 h-48 rounded-xl"></div>
        <div className="bg-slate-200 h-40 rounded-xl"></div>
      </div>
    </div>
  </div>
);

interface Props {
  initialData: AwsSnapshotData | null;
}

// --- DATA PENJELASAN PARAMETER ---
const PARAMETER_INFO = {
  temp: {
    title: "Suhu Udara",
    desc: "Ukuran panas atau dinginnya keadaan udara di suatu tempat. Data ini diukur menggunakan sensor thermometer yang terlindung dari sinar matahari langsung (radiation shield)."
  },
  humidity: {
    title: "Kelembaban Relatif",
    desc: "Persentase jumlah uap air yang ada di udara dibandingkan dengan jumlah maksimum yang dapat ditampung udara pada suhu tersebut. Semakin tinggi nilainya (mendekati 100%), udara semakin terasa lembab/basah."
  },
  heatIndex: {
    title: "Heat Index (Terasa Seperti)",
    desc: "Suhu yang sebenarnya dirasakan oleh tubuh manusia. Nilai ini adalah gabungan dari suhu udara dan kelembaban. Saat lembab, keringat sulit menguap, sehingga tubuh merasa lebih panas dari suhu termometer."
  },
  dewPoint: {
    title: "Dew Point (Titik Embun)",
    desc: "Suhu di mana uap air di udara mulai mengembun menjadi titik-titik air (embun). Semakin dekat nilai Dew Point dengan Suhu Udara, semakin tinggi peluang terjadinya kabut atau hujan."
  },
  wind: {
    title: "Kecepatan & Arah Angin",
    desc: "Pergerakan massa udara dari tekanan tinggi ke rendah. Data menampilkan kecepatan rata-rata dan arah dari mana angin berhembus (bukan ke mana angin pergi)."
  },
  rain: {
    title: "Curah Hujan",
    desc: "Jumlah air hujan yang jatuh di permukaan tanah datar selama periode tertentu. 1 milimeter (mm) hujan berarti air hujan setinggi 1 mm di atas luasan 1 meter persegi."
  },
  pressure: {
    title: "Tekanan Udara",
    desc: "Berat massa udara yang menekan permukaan bumi. Tekanan udara yang turun drastis biasanya menandakan akan datangnya cuaca buruk atau badai."
  },
  solar: {
    title: "Radiasi Matahari",
    desc: "Besarnya energi matahari yang sampai ke permukaan bumi. Data ini digunakan untuk memperkirakan potensi penguapan dan estimasi Indeks UV."
  }
};

const getCardinalDirection = (angle: number) => {
  const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
  return directions[Math.round(angle / 45) % 8];
};

export default function AwsDashboardUI({ initialData }: Props) {
  const [data, setData] = useState<AwsSnapshotData | null>(initialData);
  const [activeInfo, setActiveInfo] = useState<keyof typeof PARAMETER_INFO | null>(null);

  useEffect(() => {
    const refreshData = async () => {
      try {
        const res = await fetch('/api/aws-proxy');
        if (res.ok) {
          const json: AwsApiData = await res.json();
          const newData = transformAwsData(json);
          setData(newData);
        }
      } catch (err) {
        console.error("Auto-refresh failed", err);
      }
    };
    const interval = setInterval(refreshData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <DashboardSkeleton />;

  const sTemp = getStatus('temp', data.temp);
  const sHeat = getStatus('temp', data.heatIndex);
  const sHum = getStatus('humidity', data.humidity);
  const sWind = getStatus('wind', data.windSpeed * 3.6); 
  const sRain = getStatus('rain', data.rainRate);
  const sSolar = getStatus('solar', data.solarRad);
  const sPress = getStatus('pressure', data.pressure);

  const windKnots = (data.windSpeed * 1.94384).toFixed(1);
  const windMs = data.windSpeed.toFixed(1);

  // LOGIKA STATUS KESEHATAN SENSOR
  let statusColor = "bg-emerald-500";
  let statusText = "Online (Realtime)";
  let isStale = false;

  if (data.minutesAgo > 60) {
    statusColor = "bg-red-500";
    statusText = "Offline (> 1 Jam)";
    isStale = true;
  } else if (data.minutesAgo > 30) {
    statusColor = "bg-amber-500";
    statusText = "Warning (Data Lama)";
    isStale = true;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10 text-slate-800 font-sans">
       
       {/* --- MODAL POPUP --- */}
       {activeInfo && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveInfo(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setActiveInfo(null)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{PARAMETER_INFO[activeInfo].title}</h3>
                </div>
                
                <p className="text-slate-600 leading-7 text-sm">
                  {PARAMETER_INFO[activeInfo].desc}
                </p>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => setActiveInfo(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-sm transition"
                  >
                    Tutup
                  </button>
                </div>
            </div>
         </div>
       )}

       {/* ALERT JIKA DATA BASI */}
       {isStale && (
         <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-red-700 text-sm font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Perhatian: Data sensor tidak diperbarui sejak {data.minutesAgo} menit yang lalu. Data mungkin tidak akurat.
         </div>
       )}

       {/* HEADER */}
       <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
               <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition mt-1">
                  <ArrowLeft className="w-5 h-5" />
               </Link>
               <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">AWS Temindung</h1>
                  <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                    Data cuaca disajikan secara <span className="font-bold text-blue-600">real-time</span> dari sensor AWS.
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 self-start md:self-center">
               <div className="text-right">
                   <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> Pembaruan Terakhir
                   </div>
                   <span className="text-base font-bold text-slate-800 leading-none mt-0.5 block">{data.lastUpdate}</span>
               </div>
               
               <div className={`w-2.5 h-2.5 rounded-full ${statusColor} ${!isStale ? 'animate-pulse' : ''} ring-4 ring-white/50`} title={statusText}></div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            
            {/* === KOLOM 1 === */}
            <div className="lg:col-span-2 flex flex-col gap-5">
                
                {/* 1A. SUHU UDARA */}
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex-1 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <Thermometer className="w-5 h-5" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Suhu Udara</span>
                               <button onClick={() => setActiveInfo('temp')} className="text-slate-300 hover:text-blue-500 transition">
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                             </div>
                         </div>
                         <span className={`${sTemp.bg} ${sTemp.text} text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider`}>
                             {sTemp.label}
                         </span>
                    </div>
                    <div className="flex items-baseline mt-2">
                        <span className="text-5xl font-bold text-slate-900 tracking-tighter">{data.temp}</span>
                        <span className="text-3xl font-semibold text-slate-400 ml-1">°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-5 mt-6">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition group/dew" onClick={() => setActiveInfo('dewPoint')}>
                           <span className="font-semibold text-slate-400 group-hover/dew:text-blue-500">Dew Point:</span>
                           <span className="font-bold text-slate-700">{data.dewPoint}°C</span>
                           <HelpCircle className="w-3 h-3 text-slate-300 group-hover/dew:text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* 1B. KELEMBABAN */}
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Kelembaban</span>
                               <button onClick={() => setActiveInfo('humidity')} className="text-slate-300 hover:text-blue-500 transition">
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                            </div>
                        </div>
                        <span className={`${sHum.bg} ${sHum.text} text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider`}>{sHum.label}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{data.humidity}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{width: `${data.humidity}%`}}></div>
                    </div>
                </div>

                {/* 1C. HEAT INDEX */}
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex-1">
                    <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-3">
                             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <Activity className="w-5 h-5" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Terasa Seperti</span>
                               <button onClick={() => setActiveInfo('heatIndex')} className="text-slate-300 hover:text-blue-500 transition">
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                         <span className={`${sHeat.bg} ${sHeat.text} text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider`}>{sHeat.label}</span>
                    </div>
                    <div className="flex items-baseline mt-4">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{data.heatIndex}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">°C</span>
                    </div>
                </div>
            </div>


            {/* === KOLOM 2: ANGIN === */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Wind className="w-5 h-5" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Angin</span>
                    </div>
                    <button onClick={() => setActiveInfo('wind')} className="text-slate-300 hover:text-blue-500 transition p-1">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center relative mb-6">
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 transition-all duration-500">
                        <div className="absolute inset-2 rounded-full border border-slate-200"></div>
                        {[...Array(60)].map((_, i) => {
                            const isCardinal = i % 15 === 0;
                            const isMajor = i % 5 === 0;
                            return (
                                <div key={i} className="absolute inset-0 flex justify-center pt-2" style={{ transform: `rotate(${i * 6}deg)` }}>
                                    <div className={`w-0.5 ${isCardinal ? 'h-4 bg-slate-400 w-1' : isMajor ? 'h-2.5 bg-blue-300' : 'h-1.5 bg-blue-100'}`}></div>
                                </div>
                            )
                        })}
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-700">N</span>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-400">S</span>
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 -ml-1 text-sm font-bold text-slate-400">W</span>
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 -mr-1 text-sm font-bold text-slate-400">E</span>

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-4xl font-bold text-slate-800 mt-20 tracking-tight">{data.windDir}°</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Arah</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                             <div className="w-5 h-5 rounded-full bg-white border-[3px] border-slate-300 shadow-sm z-20"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out z-0" style={{ transform: `rotate(${data.windDir}deg)` }}>
                            <div className="absolute top-[15%] bottom-[50%] w-1.5 bg-red-500 rounded-t-full shadow-sm"></div>
                            <div className="absolute top-[15%] w-4 h-4 bg-red-500 rounded-full -mt-2"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-8 border-t border-slate-100 bg-slate-50/30 rounded-2xl mx-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">Kecepatan Angin</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-bold text-slate-900 tracking-tighter">{windMs}</span>
                        <span className="text-2xl font-semibold text-slate-400">m/s</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                        <Compass className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">{windKnots} Knots</span>
                    </div>
                    <div className="mt-5">
                        <span className={`${sWind.bg} ${sWind.text} text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm`}>
                            {sWind.label}
                        </span>
                    </div>
                </div>
            </div>


            {/* === KOLOM 3 === */}
            <div className="lg:col-span-2 flex flex-col gap-5">
                
                {/* 3A. CURAH HUJAN */}
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-3">
                             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <CloudRain className="w-5 h-5" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Curah Hujan</span>
                               <button onClick={() => setActiveInfo('rain')} className="text-slate-300 hover:text-blue-500 transition">
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                         <span className={`${sRain.bg} ${sRain.text} text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider`}>
                             {sRain.label}
                         </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{data.rainRate}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">mm</span>
                    </div>
                    <div className="flex gap-1.5 mt-6 h-2.5 w-full">
                        <div className={`flex-1 rounded-l-md transition-all ${data.rainRate >= 0 ? 'bg-slate-300' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 5 ? 'bg-sky-400' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 20 ? 'bg-yellow-400' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 50 ? 'bg-orange-400' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 rounded-r-md transition-all ${data.rainRate > 100 ? 'bg-red-500' : 'bg-slate-100'}`}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold font-mono">
                        <span>0</span><span>5</span><span>20</span><span>50</span><span>100+</span>
                    </div>
                </div>

                {/* 3B. TEKANAN UDARA */}
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <Gauge className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Tekanan</span>
                               <button onClick={() => setActiveInfo('pressure')} className="text-slate-300 hover:text-blue-500 transition">
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                            </div>
                        </div>
                        <span className={`${sPress.bg} ${sPress.text} text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider`}>{sPress.label}</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{data.pressure}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">hPa</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full mt-6 overflow-hidden relative">
                        <div className="absolute left-1/2 w-0.5 h-full bg-slate-400/50 z-10"></div> 
                        <div className="bg-blue-600 h-full transition-all" style={{width: '20%', marginLeft: `${Math.min(Math.max((data.pressure - 980)/60, 0), 1)*100}%`}}></div>
                    </div>
                </div>

                {/* 3C. RADIASI MATAHARI */}
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex-1">
                    <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-3">
                             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <Sun className="w-5 h-5" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Radiasi</span>
                               <button onClick={() => setActiveInfo('solar')} className="text-slate-300 hover:text-blue-500 transition">
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                         <span className={`${sSolar.bg} ${sSolar.text} text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider`}>{sSolar.label}</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{data.solarRad}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">W/m²</span>
                    </div>
                     <div className="mt-6 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-4">
                        <span className="font-semibold text-slate-400">UV Index (Estimasi)</span>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{data.uvIndex}</span>
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 flex items-start gap-5 mb-20 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                <Info className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">Tentang Automatic Weather Station (AWS)</h3>
                <p className="text-sm text-slate-600 leading-7 max-w-4xl">
                    Automatic Weather Station (AWS) adalah stasiun pengamatan cuaca otomatis yang didesain untuk mengukur dan merekam parameter meteorologi secara otomatis tanpa campur tangan manusia. 
                    Data yang ditampilkan di halaman ini dikirim secara real-time dari sensor yang terpasang di Stasiun Meteorologi APT Pranoto Samarinda.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}