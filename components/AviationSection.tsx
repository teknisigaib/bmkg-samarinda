import { getRawMetar, getRawTaf, getRawSpeci } from "@/lib/bmkg/aviation";
import { parseRawMetar } from "@/lib/metar-parser";
import { 
  Plane, Navigation, AlertCircle, FileText, 
  CloudRain, Layers, CalendarClock, BookOpenText, MessageSquareText
} from "lucide-react";

// --- KAMUS PENERJEMAH CERDAS (DECODER SPESIFIK) ---

function decodeCloud(cloudCode: string): string {
  if (cloudCode === "NSC") return "Tidak ada awan signifikan.";
  if (cloudCode === "CAVOK") return "Cerah, jarak pandang sangat baik.";
  
  let text = "";
  
  // 1. Ketebalan Awan
  if (cloudCode.startsWith("FEW")) text += "Sedikit awan (1-2 oktas)";
  else if (cloudCode.startsWith("SCT")) text += "Berawan sebagian (3-4 oktas)";
  else if (cloudCode.startsWith("BKN")) text += "Berawan tebal (5-7 oktas)";
  else if (cloudCode.startsWith("OVC")) text += "Mendung total (8 oktas)";
  
  // 2. Ketinggian (3 digit angka x 100 kaki)
  const heightMatch = cloudCode.match(/\d{3}/);
  if (heightMatch) {
    const height = parseInt(heightMatch[0], 10) * 100;
    // Format angka ke format Indonesia (misal: 2000 -> 2.000)
    text += ` di ketinggian ${height.toLocaleString('id-ID')} kaki`;
  }
  
  // 3. Jenis Awan Berbahaya
  if (cloudCode.includes("CB")) text += ", disertai awan badai (Cumulonimbus).";
  else if (cloudCode.includes("TCU")) text += ", disertai awan menjulang (Towering Cumulus).";
  else text += ".";

  return text || "Awan teridentifikasi.";
}

function decodeRemark(rmk: string): string {
  if (!rmk) return "NIL";
  
  let translated = rmk.toUpperCase();
  
  // Kamus sandi Remarks umum
  const dict: Record<string, string> = {
    "CB": "Awan badai (Cumulonimbus)",
    "TCU": "Awan Cumulus menjulang",
    "TO": "di/ke arah",
    "MOV": "bergerak ke",
    "AND": "dan",
    "OHD": "tepat di atas",
    "OBS": "terpantau",
    "VC": "di sekitar bandara",
    // Arah Mata Angin
    "N": "Utara",
    "NE": "Timur Laut",
    "E": "Timur",
    "SE": "Tenggara",
    "S": "Selatan",
    "SW": "Barat Daya",
    "W": "Barat",
    "NW": "Barat Laut",
  };

  // Replace kata per kata (menggunakan boundary \b agar tidak salah replace huruf N di dalam kata lain)
  Object.keys(dict).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    translated = translated.replace(regex, dict[key]);
  });

  return translated;
}

function translateWeather(weathers: string[]): string[] {
  if (!weathers || weathers.length === 0) return ["Tidak ada cuaca ekstrem saat ini."];

  return weathers.map(w => {
    let text = "";
    if (w.includes("+")) text += "Lebat: ";
    else if (w.includes("-")) text += "Ringan: ";
    if (w.includes("VC")) text += "Di area sekitar: ";

    if (w.includes("TS")) text += "Badai petir ";
    if (w.includes("SH")) text += "Hujan sesaat (Shower) ";

    if (w.includes("RA")) text += "Hujan";
    if (w.includes("DZ")) text += "Gerimis";
    if (w.includes("FG")) text += "Kabut tebal (Fog)";
    if (w.includes("BR")) text += "Kabut tipis (Mist)";
    if (w.includes("HZ")) text += "Udara kabur (Haze)";
    if (w.includes("VA")) text += "Abu vulkanik";

    return text.trim() || w;
  });
}

// --- KOMPONEN UTAMA ---

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

  const weatherTranslations = translateWeather(data.weatherConditions);

  return (
    <section className="bg-white rounded-2xl mx-4 sm:mx-6 lg:mx-12 overflow-hidden border border-slate-200 flex flex-col shadow-sm">
      
      {/* HEADER RINGKAS */}
      <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Plane className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-600 uppercase tracking-tight">Stasiun Meteorologi APT Pranoto Samarinda</h2>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase border border-blue-200 shrink-0">{data.station}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm shrink-0 w-fit">
          <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{reportTime}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* STRIP METRIK TERPADU */}
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden grid grid-cols-2 md:grid-cols-4 shadow-inner">
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
          <div className="p-4 flex flex-col items-center justify-center gap-1 border-r-0 md:border-r border-b md:border-b-0 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">Visibilitas</span>
            <span className="text-xl font-bold text-slate-800">{data.visibility.text.replace("More than ", "> ")}</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center gap-1 border-r border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">Suhu / Dew Pt</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-slate-800">{data.temperature}</span>
              <span className="text-slate-300">/</span>
              <span className="text-xl font-bold text-slate-500">{data.dewPoint}</span>
              <span className="text-xs text-slate-400 font-bold ml-0.5">°C</span>
            </div>
          </div>
          <div className="p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">QNH (Tekanan)</span>
            <span className="text-xl font-bold text-slate-800">{data.qnh}<span className="text-xs text-slate-400 ml-1">hPa</span></span>
          </div>
        </div>

        {/* INFO AWAN, CUACA, & REMARKS (DENGAN TERJEMAHAN DETAIL) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box Awan */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Layers className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-3 w-full">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Kondisi Awan</span>
              <div className="flex flex-col gap-2">
                {data.clouds.length > 0 ? (
                  data.clouds.map((c, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="w-fit text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {c}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium pl-1">
                        ↳ {decodeCloud(c)}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">NSC (Tidak ada awan signifikan)</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Box Cuaca */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <CloudRain className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-3 w-full">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Fenomena Cuaca</span>
              <div className="flex flex-col gap-2">
                {data.weatherConditions.length > 0 ? (
                  data.weatherConditions.map((w, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="w-fit text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {w}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium pl-1">
                        ↳ {weatherTranslations[i]}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">NIL (Tidak ada cuaca ekstrem)</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Box Remarks */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <MessageSquareText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-3 w-full">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Remarks (RMK)</span>
              <div className="flex flex-col gap-2">
                {data.remarks.length > 0 ? (
                  data.remarks.map((r, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="w-fit text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {r}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium pl-1 leading-relaxed">
                        ↳ {decodeRemark(r)}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">NIL (Tidak ada catatan)</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RAW DATA PANEL */}
        {/* RAW DATA PANEL */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* METAR */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">METAR</span>
              </div>
              <div className="text-[13px] text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                {latestRawString}
              </div>
            </div>
            
            {/* 👉 SPECI (DENGAN SOFT ALERT) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpenText className={`w-3.5 h-3.5 ${latestSpeciString ? 'text-rose-500' : 'text-blue-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${latestSpeciString ? 'text-rose-600' : 'text-blue-600'}`}>
                    SPECI
                  </span>
                </div>
                {/* Indikator Halus jika SPECI Aktif */}
                {latestSpeciString && (
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-rose-500 bg-rose-100/50 px-2 py-0.5 rounded-full border border-rose-100">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                    </span>
                  </span>
                )}
              </div>
              
              {latestSpeciString ? (
                <div className="text-[13px] text-rose-900 leading-relaxed bg-rose-50/50 p-3 rounded-lg border border-rose-200 shadow-sm transition-all duration-300">
                  {latestSpeciString}
                </div>
              ) : (
                <div className="text-[13px] text-slate-400 italic py-4 bg-white/50 rounded-lg border border-dashed border-slate-200 text-center h-full flex items-center justify-center">
                  Nihil (Tidak Ada Speci)
                </div>
              )}
            </div>

            {/* TAF */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">TAF</span>
              </div>
              <div className="text-[13px] text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 shadow-sm line-clamp-3 hover:line-clamp-none transition-all cursor-pointer" title="Klik/Hover untuk memanjangkan teks">
                {latestTafString || "N/A"}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}