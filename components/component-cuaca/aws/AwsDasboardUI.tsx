"use client";

import React, { useState, useEffect } from "react";
import { 
  Thermometer, Droplets, Wind, Sun, Gauge, 
  Clock, CloudRain, Activity, Compass, Info, HelpCircle, X, AlertTriangle, Navigation2,Radio, BookOpen
} from "lucide-react";
import { AwsSnapshotData, AwsApiData } from "@/lib/aws-types";
import { getStatus, transformAwsData } from "@/lib/aws-utils";

// KOMPONEN SKELETON 
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

// DATA PENJELASAN PARAMETER
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

  // LOGIKA STATUS
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
    <div className="min-h-screen text-slate-800">
       
       {/* MODAL POPUP */}
       {activeInfo && (
         <div className=" inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveInfo(null)}>
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

       {/* ALERT DATA*/}
       {isStale && (
         <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-red-700 text-sm font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Perhatian: Data sensor tidak diperbarui sejak {data.minutesAgo} menit yang lalu. Data mungkin tidak akurat.
         </div>
       )}

       {/*  HEADER  */}
        <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center text-center md:items-start md:text-left shadow-sm">
          <div className="bg-white p-3 rounded-full shadow-sm w-fit">
            <Radio className="w-8 h-8 text-blue-600" />
          </div>
  
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">AWS Temindung</h2>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              Monitoring data cuaca <strong className="text-blue-600">real-time</strong> dari Automatic Weather Station (AWS) di Stasiun Meteorologi APT Pranoto.
            </p>
            {/* Container Badge  */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Badge Status (Online/Gangguan) */}
              <div className={`inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-xs font-bold shadow-sm ${
                !isStale 
                  ? 'border-emerald-200 text-emerald-700' 
                  : 'border-amber-200 text-amber-700'
                }`}>
                <span className="relative flex h-2.5 w-2.5">
                  {!isStale && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${!isStale ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              {!isStale ? 'Status: Online' : 'Status: Gangguan'}
          </div>
          
          {/* Badge Waktu Update */}
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-medium text-gray-600 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Update: {data.lastUpdateDate} {data.lastUpdateTime} UTC
          </div>

        </div>
          </div>
        </section>

      <div className="max-w-[1600px] mx-auto  mt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
            
            {/*  KOLOM 1 */}
            <div className="lg:col-span-2 flex flex-col gap-5">
                
                {/*  SUHU UDARA */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                                <Thermometer className="w-4 h-4" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suhu Udara</span>
                               <button onClick={() => setActiveInfo('temp')} className="text-slate-300 hover:text-blue-600 transition">
                                 <HelpCircle className="w-3.5 h-3.5" />
                               </button>
                             </div>
                         </div>
                    </div>
                    <div className="flex items-baseline mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tighter">{data.temp}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3 mt-4">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-700 transition group/dew" onClick={() => setActiveInfo('dewPoint')}>
                           <span className="font-semibold text-slate-400 group-hover/dew:text-blue-600">Dew Point:</span>
                           <span className="font-bold text-slate-700">{data.dewPoint}°C</span>
                        </div>
                    </div>
                </div>

                {/*  KELEMBABAN */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                                <Droplets className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kelembaban</span>
                               <button onClick={() => setActiveInfo('humidity')} className="text-slate-300 hover:text-blue-600 transition">
                                 <HelpCircle className="w-3.5 h-3.5" />
                               </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline mt-1">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.humidity}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{width: `${data.humidity}%`}}></div>
                    </div>
                </div>

                {/* HEAT INDEX */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                                <Activity className="w-4 h-4" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Terasa Seperti</span>
                               <button onClick={() => setActiveInfo('heatIndex')} className="text-slate-300 hover:text-blue-600 transition">
                                 <HelpCircle className="w-3.5 h-3.5" />
                               </button>
                            </div>
                         </div>
                    </div>
                    <div className="flex items-baseline mt-1">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.heatIndex}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">°C</span>
                    </div>
                </div>
            </div>


            {/* ANGIN */}
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex flex-col h-full hover:border-blue-300 transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                            <Wind className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Angin</span>
                    </div>
                    <button onClick={() => setActiveInfo('wind')} className="text-slate-300 hover:text-blue-600 transition p-1">
                        <HelpCircle className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center relative mb-4">
                    <div className="relative w-56 h-56 sm:w-72 sm:h-72 transition-all duration-500">
                        
                        <div className="absolute inset-1 rounded-full border border-blue-400 bg-slate-50/20 z-50"></div>
                        
                        {[...Array(360)].map((_, i) => {
                            const degree = i;
                            const isCardinal = degree % 90 === 0;
                            const isMajor = degree % 15 === 0;
                            const isMedium = degree % 5 === 0;

                            let tickClass = "h-1.5 w-[1px] bg-slate-200"; 
                            if (isCardinal) { tickClass = "h-4 w-1 bg-slate-800 z-30"; }
                            else if (isMajor) { tickClass = "h-3 w-0.5 bg-slate-400 z-20"; } 
                            else if (isMedium) { tickClass = "h-2 w-[1px] bg-slate-300 z-10"; }

                            return (
                                <div key={i} className="absolute inset-0 flex justify-center pt-1" style={{ transform: `rotate(${degree}deg)` }}>
                                    <div className={tickClass}></div>
                                </div>
                            )
                        })}

                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[12px] font-bold text-slate-700">U</span>
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[12px] font-bold text-slate-700">S</span>
                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 -ml-1 text-[12px] font-bold text-slate-700">B</span>
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 -mr-1 text-[12px] font-bold text-slate-700">T</span>

                        <span className="absolute top-[10%] right-[10%] text-[9px] font-bold text-slate-500">TL</span>
                        <span className="absolute bottom-[10%] right-[10%] text-[9px] font-bold text-slate-500">TG</span>
                        <span className="absolute bottom-[10%] left-[10%] text-[9px] font-bold text-slate-500">BD</span>
                        <span className="absolute top-[10%] left-[10%] text-[9px] font-bold text-slate-500">BL</span>

                        {/* Navigation Arrow  */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="transition-transform duration-1000 ease-out flex items-center justify-center" style={{ transform: `rotate(${data.windDir}deg)` }}>
                                <Navigation2 className="w-12 h-12 text-blue-700 fill-blue-700 drop-shadow-md" strokeWidth={0} />
                            </div>
                        </div>

                        {/* Floating Info */}
                        <div className="absolute bottom-10 inset-x-0 flex justify-center z-20">
                            <div className="flex flex-col items-center bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm px-4 py-1.5 rounded-xl">
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xl font-bold text-slate-800 tracking-tight">{data.windDir}</span>
                                    <span className="text-xl font-bold text-slate-400">°</span>
                                </div>
                                
                            </div>
                        </div>
                        
                        
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-5 border-t border-slate-100 bg-slate-50 rounded-3xl mx-1 mt-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Kecepatan Angin</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-slate-800 tracking-tighter">{windMs}</span>
                        <span className="text-xl font-semibold text-slate-400">m/s</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                        <Compass className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{windKnots} Knots</span>
                    </div>
                </div>
            </div>


            {/*  KOLOM 3 */}
            <div className="lg:col-span-2 flex flex-col gap-5">
                
                {/* CURAH HUJAN */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 flex flex-col justify-between hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                                <CloudRain className="w-4 h-4" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Curah Hujan</span>
                               <button onClick={() => setActiveInfo('rain')} className="text-slate-300 hover:text-blue-600 transition">
                                 <HelpCircle className="w-3.5 h-3.5" />
                               </button>
                            </div>
                         </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.rainRate}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">mm</span>
                    </div>

                    <div className="flex gap-1 mt-4 h-2 w-full">
                        <div className={`flex-1 rounded-l-md transition-all ${data.rainRate >= 0 ? 'bg-slate-300' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 5 ? 'bg-blue-300' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 20 ? 'bg-blue-500' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 50 ? 'bg-blue-700' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 rounded-r-md transition-all ${data.rainRate > 100 ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-bold font-mono">
                        <span>0</span><span>5</span><span>20</span><span>50</span><span>100+</span>
                    </div>
                </div>

                {/* TEKANAN UDARA */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                                <Gauge className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tekanan</span>
                               <button onClick={() => setActiveInfo('pressure')} className="text-slate-300 hover:text-blue-600 transition">
                                 <HelpCircle className="w-3.5 h-3.5" />
                               </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.pressure}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">hPa</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
                        <div className="absolute left-1/2 w-0.5 h-full bg-slate-300 z-10"></div> 
                        <div className="bg-blue-600 h-full transition-all" style={{width: '20%', marginLeft: `${Math.min(Math.max((data.pressure - 980)/60, 0), 1)*100}%`}}></div>
                    </div>
                </div>

                {/* RADIASI MATAHARI */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg">
                                <Sun className="w-4 h-4" />
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Radiasi</span>
                               <button onClick={() => setActiveInfo('solar')} className="text-slate-300 hover:text-blue-600 transition">
                                 <HelpCircle className="w-3.5 h-3.5" />
                               </button>
                            </div>
                         </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.solarRad}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">W/m²</span>
                    </div>
                     <div className="mt-4 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-3">
                        <span className="font-semibold text-slate-400">UV Index (Estimasi)</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{data.uvIndex}</span>
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-5 items-start mt-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-sm mb-2">Apa itu Automatic Weather Station (AWS)?</h5>
            <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
              <strong>Automatic Weather Station (AWS)</strong> adalah stasiun pengamatan cuaca otomatis yang didesain untuk mengukur dan merekam parameter meteorologi secara otomatis tanpa campur tangan manusia. 
                    Data yang ditampilkan di halaman ini dikirim secara real-time dari sensor yang terpasang di Stasiun Meteorologi APT Pranoto Samarinda.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}







{/* FOOTER */}
        
        