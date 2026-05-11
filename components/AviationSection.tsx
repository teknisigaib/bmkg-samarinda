import { getRawMetar, getRawTaf, getRawSpeci } from "@/lib/bmkg/aviation";
import { parseRawMetar } from "@/lib/metar-parser";
import { 
  Plane, Wind, Eye, Thermometer, Navigation, 
  AlertCircle, FileText, Gauge, CloudRain, Layers, CalendarClock, BookOpenText
} from "lucide-react";

export default async function AviationSection() {
  const ICAO_CODE = "WALS";

  let data = null;
  let latestRawString = null;
  let latestTafString = null;
  let latestSpeciString = null;
  let errorMsg = null;

  try {
      const [rawMetars, rawTafs, rawSpecis] = await Promise.all([
        getRawMetar(ICAO_CODE).catch(() => []),
        getRawTaf(ICAO_CODE).catch(() => []),
        getRawSpeci(ICAO_CODE).catch(() => [])
      ]);

      latestRawString = (rawMetars && rawMetars.length > 0) ? rawMetars[0].data_text : null;
      latestTafString = (rawTafs && rawTafs.length > 0) ? rawTafs[0].data_text : null;
      latestSpeciString = (rawSpecis && rawSpecis.length > 0) ? rawSpecis[0].data_text : null;

      if (latestRawString) {
          data = parseRawMetar(latestRawString);
      } else {
          errorMsg = "Data penerbangan tidak ditemukan.";
      }
  } catch (err) {
      errorMsg = "Sistem gagal memuat data aviasi.";
  }

  if (!data || !latestRawString) {
    return (
      <section className="bg-white border border-slate-200 shadow-sm rounded-2xl mx-4 sm:mx-6 lg:mx-12 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-slate-300" />
            <h3 className="font-bold text-lg text-slate-800">Laporan Penerbangan Tidak Tersedia</h3>
            <p className="text-slate-500 text-sm">{errorMsg}</p>
        </div>
      </section>
    );
  }

  const reportTime = new Date(data.time).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
  }) + " UTC";

  const isVariableWind = data.wind.direction === "VRB";
  const windDirValue = isVariableWind ? 0 : (data.wind.direction as number);

  return (
    <section className="bg-white rounded-2xl mx-4 sm:mx-6 lg:mx-12 overflow-hidden border border-slate-200 flex flex-col shadow-sm">
      
      {/* HEADER RINGKAS DENGAN AKSEN BIRU */}
      <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Plane className="w-5 h-5 text-blue-600" />
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-600 uppercase tracking-tight">Stasiun Meteorologi APT Pranoto Samarinda</h2>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase border border-blue-200">{data.station}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
          <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{reportTime}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* STRIP METRIK TERPADU - RATA TENGAH (CENTERED) */}
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden grid grid-cols-2 md:grid-cols-4 shadow-inner">
          
          {/* Metrik: Angin */}
          <div className="p-4 flex flex-col items-center justify-center gap-1 border-r border-b md:border-b-0 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">Angin</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-800">{data.wind.speed}<span className="text-xs text-slate-400 ml-0.5">KT</span></span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                <Navigation className={`w-2.5 h-2.5 ${isVariableWind ? 'animate-spin' : ''}`} style={{ transform: isVariableWind ? '' : `rotate(${windDirValue}deg)` }} />
                {isVariableWind ? "VRB" : `${windDirValue}°`}
              </div>
            </div>
          </div>

          {/* Metrik: Jarak Pandang */}
          <div className="p-4 flex flex-col items-center justify-center gap-1 border-r-0 md:border-r border-b md:border-b-0 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">Visibilitas</span>
            <span className="text-xl font-bold text-slate-800">{data.visibility.text.replace("More than ", "> ")}</span>
          </div>

          {/* Metrik: Suhu (Ringkas: Suhu & Dewpoint) */}
          <div className="p-4 flex flex-col items-center justify-center gap-1 border-r border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">Suhu / Dew Pt</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-slate-800">{data.temperature}</span>
              <span className="text-slate-300">/</span>
              <span className="text-xl font-bold text-slate-500">{data.dewPoint}</span>
              <span className="text-xs text-slate-400 font-bold ml-0.5">°C</span>
            </div>
          </div>

          {/* Metrik: Tekanan */}
          <div className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">QNH (Tekanan)</span>
            <span className="text-xl font-bold text-slate-800">{data.qnh}<span className="text-xs text-slate-400 ml-1">hPa</span></span>
          </div>

        </div>

        {/* INFO AWAN & CUACA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Layers className="w-4 h-4 text-blue-500" />
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase w-12">Awan:</span>
              <div className="flex flex-wrap gap-1.5">
                {data.clouds.length > 0 ? (
                  data.clouds.map((c, i) => <span key={i} className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{c}</span>)
                ) : <span className="text-[11px] text-slate-400 italic">NSC (No Significant Clouds)</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase w-12">Cuaca:</span>
              <div className="flex flex-wrap gap-1.5">
                {data.weatherConditions.length > 0 ? (
                  data.weatherConditions.map((w, i) => <span key={i} className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{w}</span>)
                ) : <span className="text-[11px] text-slate-400 italic">Tidak ada cuaca signifikan</span>}
              </div>
            </div>
          </div>
        </div>

        {/* RAW DATA PANEL */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* METAR */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">METAR</span>
              </div>
              <div className="text-[13px] text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 shadow-sm">{latestRawString}</div>
            </div>
            
            {/* SPECI */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BookOpenText className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">SPECI</span>
              </div>
              {latestSpeciString ? (
                <div className="text-[13px] text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 shadow-sm">{latestSpeciString}</div>
              ) : (
                <div className="text-[11px] text-slate-400 italic py-4 bg-white/50 rounded-lg border border-dashed border-slate-200 text-center h-full flex items-center justify-center">Nihil</div>
              )}
            </div>

            {/* TAF */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">TAF</span>
              </div>
              <div className="text-[12px] text-slate-500 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 shadow-sm line-clamp-3 hover:line-clamp-none transition-all">{latestTafString || "N/A"}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}