import { getRawMetar, getRawTaf } from "@/lib/bmkg/aviation";
import { parseRawMetar } from "@/lib/metar-parser";
import { 
  Plane, Wind, Eye, Thermometer, Navigation, 
  ArrowDown, AlertCircle, FileText, Gauge,
  CloudRain, Layers, CalendarClock, Info 
} from "lucide-react";

export default async function AviationSection() {
  const ICAO_CODE = "WALS";
  const RUNWAY_ACTUAL_HEADING = 40; 

  let data = null;
  let latestRawString = null;
  let latestTafString = null;
  let errorMsg = null;

  try {
      const [rawMetars, rawTafs] = await Promise.all([
        getRawMetar(ICAO_CODE).catch(() => []),
        getRawTaf(ICAO_CODE).catch(() => [])
      ]);

      latestRawString = (rawMetars && rawMetars.length > 0) ? rawMetars[0].data_text : null;
      latestTafString = (rawTafs && rawTafs.length > 0) ? rawTafs[0].data_text : null;

      if (latestRawString) {
          data = parseRawMetar(latestRawString);
      } else {
          errorMsg = "Data METAR tidak ditemukan dari sumber BMKG.";
      }
  } catch (err) {
      errorMsg = "Terjadi kesalahan sistem saat mengambil data.";
  }

  if (!data || !latestRawString) {
    return (
      <section className="bg-slate-50 text-slate-900 py-16 text-center rounded-[2.5rem] mx-4 border border-slate-200 shadow-lg">
        <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <h3 className="font-bold text-2xl text-slate-900">Data Penerbangan Tidak Tersedia</h3>
            <p className="text-slate-600 mt-2 text-sm">{errorMsg || "Menunggu data..."}</p>
        </div>
      </section>
    );
  }

  const reportTime = new Date(data.time).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
  }) + " UTC";

  const isVariableWind = data.wind.direction === "VRB";
  const windDirValue = isVariableWind ? 0 : (data.wind.direction as number);
  const hasTrends = data.trends.length > 0;
  const hasRemarks = data.remarks.length > 0;

  return (
    <section className="bg-slate-50 text-slate-900 py-16 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200">
      
      <div className="absolute -top-20 -right-20 p-10 opacity-[0.05] pointer-events-none text-slate-900">
        <Plane className="w-[500px] h-[500px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-slate-200 pb-8">
            <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold tracking-widest text-xs uppercase mb-2">
                    <Plane className="w-4 h-4" />
                    Meteorologi Penerbangan
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Stasiun Meteorologi APT Pranoto <span className="text-slate-500 font-medium text-2xl ml-2">({data.station})</span>
                </h2>
            </div>
            <div className="text-right bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Observation Time</p>
                <p className="text-3xl font-bold text-blue-600">{reportTime}</p>
            </div>
        </div>
        
        <div className="flex flex-col gap-6">

            {/* BARIS 1: 4 METRIK UTAMA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Wind */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-3 tracking-wider">
                        <Wind className="w-3.5 h-3.5 text-blue-500" /> Wind
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">{data.wind.speed}</span>
                        <span className="text-sm font-bold text-slate-400">{data.wind.unit}</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-2 flex items-center gap-2 bg-blue-50 py-1 px-2 rounded w-fit border border-blue-100">
                        {isVariableWind ? <Navigation className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" style={{ transform: `rotate(${windDirValue}deg)` }} />}
                        {isVariableWind ? "VRB" : `${windDirValue.toString().padStart(3, '0')}°`}
                    </div>
                </div>

                {/* Visibility */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-3 tracking-wider">
                        <Eye className="w-3.5 h-3.5 text-blue-500" /> Visibility
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900 truncate">{data.visibility.text}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-2 font-medium">{data.visibility.meters >= 10000 ? "Clear / CAVOK" : "Observed"}</div>
                </div>

                {/* Temp */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-3 tracking-wider">
                        <Thermometer className="w-3.5 h-3.5 text-blue-500" /> Temp
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">{data.temperature ?? "--"}</span>
                        <span className="text-sm font-bold text-slate-400">°C</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">Dew Point: <span className="text-slate-700 font-bold">{data.dewPoint ?? "--"}°C</span></div>
                </div>

                {/* Pressure */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-3 tracking-wider">
                        <Gauge className="w-3.5 h-3.5 text-blue-500" /> Pressure
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">{data.qnh ?? "--"}</span>
                        <span className="text-sm font-bold text-slate-400">hPa</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">QNH / Altimeter</div>
                </div>
            </div>

            {/* BARIS 2: VISUALISASI RUNWAY & WEATHER (DIPASTIKAN SEJAJAR) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                
                {/* KOLOM KIRI: Visualisasi Runway */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-center relative overflow-hidden h-full min-h-[20rem] group shadow-md hover:border-blue-400">
                    <span className="absolute top-3 left-3 text-[9px] text-sky-800 font-bold tracking-widest bg-white/60 px-2 py-0.5 rounded border border-slate-200 z-30">RUNWAY 04/22</span>
                    
                    {/* Compass */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="w-56 h-56 border-2 border-dashed border-sky-400 rounded-full relative">
                             <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sky-600 bg-sky-100 px-1">N</span>
                        </div>
                    </div>

                    {/* Strip */}
                    <div className="absolute flex flex-col items-center justify-center py-4 transition-transform duration-500" style={{ transform: `rotate(${RUNWAY_ACTUAL_HEADING}deg)` }}>
                        <div className="w-16 h-48 bg-slate-300 border-x-[3px] border-slate-400 relative flex flex-col justify-between items-center py-3 shadow-xl z-10">
                            <div className="flex flex-col items-center">
                                 <div className="flex gap-0.5 mb-1.5">{[...Array(3)].map((_,i) => <div key={i} className="w-1 h-3 bg-white"></div>)}</div>
                                <span className="text-slate-700 font-black text-xl rotate-180 drop-shadow-sm">22</span>
                            </div>
                            <div className="h-full w-1 border-l-2 border-dashed border-slate-100 my-1"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-700 font-black text-xl drop-shadow-sm">04</span>
                                 <div className="flex gap-0.5 mt-1.5">{[...Array(3)].map((_,i) => <div key={i} className="w-1 h-3 bg-white"></div>)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Wind Arrow */}
                    {isVariableWind ? (
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                             <div className="bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-red-200 shadow-sm animate-pulse">VRB</div>
                         </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-1000 ease-out z-30" style={{ transform: `rotate(${windDirValue}deg)` }}>
                            <div className="flex flex-col items-center relative -top-20">
                                <div className="bg-white/90 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-200 shadow-sm mb-1 whitespace-nowrap">{data.wind.speed} KT</div>
                                <ArrowDown className="w-12 h-12 text-blue-600 drop-shadow-lg filter" strokeWidth={3} />
                            </div>
                        </div>
                    )}
                </div>

                {/* KOLOM KANAN: Weather & Clouds */}
                {/* h-full memastikan wrapper ini setinggi Runway. */}
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                    
                    {/* flex-1 memastikan kartu ini memenuhi ruang kosong. */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 flex-1 hover:border-blue-400">
                        <div>
                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-wider">
                                <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Weather & Forecast
                            </div>
                            <div className="flex flex-wrap gap-2 items-start">
                                {data.weatherConditions && data.weatherConditions.length > 0 ? (
                                    data.weatherConditions.map((wx, i) => (
                                        <span key={`wx-${i}`} className="bg-blue-50 px-3 py-1.5 rounded-lg text-md  font-black text-blue-600 border border-blue-200">{wx}</span>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-2 opacity-70">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs  text-slate-500 border border-slate-200">NSW</span>
                                        <span className="text-xs text-slate-500 font-medium">No Significant Weather</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(hasTrends || hasRemarks) && <div className="h-px bg-slate-100 w-full mt-auto"></div>}

                        {(hasTrends || hasRemarks) && (
                            <div className="flex flex-col gap-2">
                                {data.trends.map((t, i) => (
                                    <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <AlertCircle className="w-3 h-3 text-amber-600" />
                                            <span className="text-[10px] font-bold text-amber-700 uppercase">{t.type}</span>
                                        </div>
                                        <p className="text-xs text-amber-900 leading-tight">{t.fullText}</p>
                                    </div>
                                ))}
                                {data.remarks.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Info className="w-3 h-3 text-slate-500" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Remarks</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-tight">{data.remarks.join(" ")}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* flex-1 memastikan kartu ini juga ikut meregang. */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 hover:border-blue-400">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-wider">
                            <Layers className="w-3.5 h-3.5 text-blue-500" /> Cloud Coverage
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.clouds.length > 0 ? (
                                data.clouds.map((cloudStr, i) => {
                                    const isThick = cloudStr.includes("OVC") || cloudStr.includes("BKN");
                                    return (<span key={i} className={`px-2 py-1 rounded-lg text-md font-bold border shadow-sm ${isThick ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}>{cloudStr}</span>)
                                })
                            ) : (<span className="text-slate-500 text-xs italic">NSC / Clear</span>)}
                        </div>
                    </div>

                </div>
            </div>

            {/* BARIS 3: RAW DATA (DIPASTIKAN SEJAJAR) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <div className="bg-slate-700 p-4 rounded-xl border border-slate-200 transition-colors shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">METAR</span>
                        </div>
                        <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200">Observed</span>
                    </div>
                    <code className="block text-md text-white font-medium break-words leading-relaxed flex-1">
                        {latestRawString}
                    </code>
                </div>
                
                <div className="bg-slate-700 p-4 rounded-xl border border-slate-200 transition-colors shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                             <CalendarClock className="w-3 h-3 text-white" />
                             <span className="text-white text-[10px] font-bold uppercase tracking-wider">TAF</span>
                        </div>
                        <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200">Predicted</span>
                    </div>
                    <code className="block font-mono text-md text-white font-medium break-words leading-relaxed flex-1">
                        {latestTafString || "Forecast not available."}
                    </code>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}