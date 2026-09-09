"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { Flame, Download, Filter, Loader2, CalendarDays, RefreshCw } from "lucide-react";
import HotspotControl from "./HotspotControl";

const HotspotMap = dynamic(() => import("./HotspotMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center">
      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
      <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">Memuat Engine Peta...</span>
    </div>
  ),
});

interface HotspotItem {
  id: number; bujur: string; lintang: string; kepercayaan: number;
  kabupaten: string; kecamatan: string; satelit: string; tanggal: string; waktu: string;
}

const API_BASE_URL = "https://hotspot.bmkgaptpranoto.com/api/hotspot";

const getTodayAPIStr = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function HotspotMapWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  const todayStr = getTodayAPIStr();
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = useState(todayStr);
  
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 6);
  const startStr = `${defaultStart.getFullYear()}-${String(defaultStart.getMonth()+1).padStart(2,'0')}-${String(defaultStart.getDate()).padStart(2,'0')}`;
  
  const [startDate, setStartDate] = useState(startStr);
  const [endDate, setEndDate] = useState(todayStr);
  
  const [filterKab, setFilterKab] = useState("ALL");
  const [filterConf, setFilterConf] = useState<"ALL" | "TINGGI" | "SEDANG" | "RENDAH">("ALL");
  const [filterSat, setFilterSat] = useState<string>("ALL");
  
  const [mapStyle, setMapStyle] = useState("satellite");

  const [spartanDate, setSpartanDate] = useState(todayStr);
  const [showFfmc, setShowFfmc] = useState(false);
  const [showIsi, setShowIsi] = useState(false);
  const [showFwi, setShowFwi] = useState(false);
  const [spartanOpacity, setSpartanOpacity] = useState(0.65); 

  const [tableData, setTableData] = useState<HotspotItem[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  
  // 🚀 STATE BARU: Untuk menyimpan tanggal/waktu update data terbaru
  const [latestDataDate, setLatestDataDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoadingTable(true);
      try {
        let url = `${API_BASE_URL}?`;
        if (dateMode === 'single') url += `tanggal=${singleDate}`;
        else url += `start_date=${startDate}&end_date=${endDate}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal load data API");
        const json = await res.json();
        
        let dataArray: HotspotItem[] = [];
        if (json.sukses && Array.isArray(json.data)) {
            dataArray = json.data;
        } else if (Array.isArray(json)) {
            dataArray = json;
        }

        if (dataArray.length > 0) {
          const sorted = dataArray.sort((a: HotspotItem, b: HotspotItem) => b.kepercayaan - a.kepercayaan);
          setTableData(sorted);

          // 🚀 AMBIL TANGGAL TERBARU DARI DATA
          // Mengambil dari properti tanggal item pertama, atau jika format tanggal mengandung 'T', kita ambil tanggal saja
          const newestItem = sorted[0];
          if (newestItem?.tanggal) {
             const cleanDate = newestItem.tanggal.split("T")[0];
             const waktuText = newestItem.waktu ? ` (${newestItem.waktu} WIB)` : '';
             setLatestDataDate(`${cleanDate}${waktuText}`);
          } else {
             setLatestDataDate(todayStr);
          }

        } else {
          setTableData([]);
          setLatestDataDate(null);
        }
      } catch (error) {
        console.error("Gagal menarik data tabel:", error);
        setTableData([]);
        setLatestDataDate(null);
      } finally {
        setIsLoadingTable(false);
      }
    };

    if (isMounted) fetchTableData();
  }, [dateMode, singleDate, startDate, endDate, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uniqueSatellites = useMemo(() => {
    const sats = new Set(tableData.map(d => d.satelit));
    return Array.from(sats);
  }, [tableData]);

  const displayedData = useMemo(() => {
    return tableData.filter(item => {
      let passKab = filterKab === "ALL" || (item.kabupaten && item.kabupaten.toUpperCase().includes(filterKab));
      let passConf = true;
      if (filterConf === "TINGGI") passConf = item.kepercayaan >= 9;
      else if (filterConf === "SEDANG") passConf = item.kepercayaan >= 7 && item.kepercayaan < 9;
      else if (filterConf === "RENDAH") passConf = item.kepercayaan < 7;
      let passSat = filterSat === "ALL" || item.satelit === filterSat;

      return passKab && passConf && passSat;
    });
  }, [tableData, filterKab, filterConf, filterSat]);

  const hotspotStats = useMemo(() => {
    let tinggi = 0, sedang = 0, rendah = 0;
    displayedData.forEach(d => {
      if (d.kepercayaan >= 9) tinggi++;
      else if (d.kepercayaan >= 7) sedang++;
      else rendah++;
    });
    return { total: displayedData.length, tinggi, sedang, rendah };
  }, [displayedData]);

  const handleExportCSV = () => {
    const headers = ["No", "Kabupaten/Kota", "Kecamatan", "Tingkat Kepercayaan", "Level", "Satelit", "Tanggal", "Waktu (WIB)", "Latitude", "Longitude"];
    const rows = displayedData.map((d, i) => {
      const level = d.kepercayaan >= 9 ? "Tinggi" : d.kepercayaan >= 7 ? "Sedang" : "Rendah";
      return [
        i + 1, `"${d.kabupaten}"`, `"${d.kecamatan}"`, d.kepercayaan, level, d.satelit, d.tanggal.split("T")[0], d.waktu, d.lintang, d.bujur
      ];
    });
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Hotspot_Kaltim.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden pb-10"> 
      
      <style dangerouslySetInnerHTML={{__html: `
        #karhutla-map-wrapper:fullscreen { height: 100vh !important; width: 100vw !important; border-radius: 0 !important; border: none !important; }
        #karhutla-map-wrapper:-webkit-full-screen { height: 100vh !important; width: 100vw !important; border-radius: 0 !important; border: none !important; }
      `}} />

      <section className="relative flex flex-col items-center justify-center text-center mb-6 max-w-3xl mx-auto pt-0">
         <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Monitoring Hotspot
         </h1>
         <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
            Peta sebaran titik panas di wilayah Kalimantan Timur berdasarkan pantauan satelit sebagai peringatan dini kebakaran hutan dan lahan.
         </p>
         
         <div className="relative z-10 flex flex-wrap items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               <Flame className="w-4 h-4 text-orange-500" />
               {isLoadingTable ? (
                  <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
               ) : (
                  <span className="text-xs font-bold text-slate-700">{displayedData.length} Titik Terfilter</span>
               )}
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               <CalendarDays className="w-4 h-4 text-blue-500" />
               <span className="text-xs font-bold text-slate-700">{dateMode === "single" ? singleDate : `${startDate} s/d ${endDate}`}</span>
            </div>
            
            {/* 🚀 BADGE HARI/TANGGAL DATA TERBARU */}
            <div className="flex items-center gap-2 px-4 py-1.5">
               <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoadingTable ? 'animate-spin text-blue-500' : ''}`} />
               <span className="text-xs font-semibold text-slate-600">
                  {latestDataDate ? `Updated: ${latestDataDate}` : "Live API"}
               </span>
            </div>
         </div>
      </section>

      {/* --- KONTROL & PETA --- */}
      <div id="karhutla-map-wrapper" className="relative group rounded-2xl shadow-lg border border-slate-200/50 bg-slate-100 h-[600px] w-full overflow-hidden z-0">
        
        <HotspotControl 
            dateMode={dateMode} setDateMode={setDateMode}
            singleDate={singleDate} setSingleDate={setSingleDate}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            filterKab={filterKab} setFilterKab={setFilterKab}
            filterConf={filterConf} setFilterConf={setFilterConf}
            mapStyle={mapStyle} setMapStyle={setMapStyle}
            spartanDate={spartanDate} setSpartanDate={setSpartanDate}
            showFfmc={showFfmc} setShowFfmc={setShowFfmc}
            showIsi={showIsi} setShowIsi={setShowIsi}
            showFwi={showFwi} setShowFwi={setShowFwi}
            spartanOpacity={spartanOpacity} setSpartanOpacity={setSpartanOpacity} 
            hotspotStats={hotspotStats}
            isLoadingHotspot={isLoadingTable}
        />

        <HotspotMap 
            data={displayedData} 
            mapStyle={mapStyle} 
            spartanDate={spartanDate}
            showFfmc={showFfmc}
            showIsi={showIsi}
            showFwi={showFwi}
            spartanOpacity={spartanOpacity} 
        />
      </div>

      {/* --- TABEL DATA --- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full mt-6">
        <div className="p-4 md:p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Rincian Titik Hotspot
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Menampilkan {displayedData.length} Titik (Total Query Server: {tableData.length})
                </span>
            </div>
            
            <button 
                onClick={handleExportCSV}
                disabled={displayedData.length === 0}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download className="w-3.5 h-3.5" /> Unduh CSV
            </button>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
               <Filter className="w-3.5 h-3.5" /> Filter Tambahan Tabel:
            </span>
            <select 
               className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 outline-none cursor-pointer"
               value={filterSat}
               onChange={(e) => setFilterSat(e.target.value)}
            >
               <option value="ALL">Semua Satelit</option>
               {uniqueSatellites.map(sat => (
                 <option key={sat} value={sat}>{sat}</option>
               ))}
            </select>
        </div>

        <div className="overflow-x-auto w-full max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto max-h-[400px] overflow-y-auto custom-scrollbar relative">
            <table className="w-full text-sm text-left relative">
                <thead className="bg-white text-slate-500 font-bold uppercase text-[10px] tracking-widest sticky top-0 z-10 shadow-sm outline outline-1 outline-slate-100">
                    <tr>
                        <th className="px-5 py-4 w-10 text-center bg-white whitespace-nowrap">No</th>
                        <th className="px-5 py-4 bg-white min-w-[180px]">Wilayah Administrasi</th>
                        <th className="px-5 py-4 bg-white whitespace-nowrap">Tingkat Kepercayaan</th>
                        <th className="px-5 py-4 bg-white hidden md:table-cell whitespace-nowrap">Satelit</th>
                        <th className="px-5 py-4 bg-white hidden md:table-cell whitespace-nowrap">Waktu (WIB)</th>
                        <th className="px-5 py-4 text-right bg-white whitespace-nowrap">Titik Koordinat</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoadingTable ? (
                        <tr>
                            <td colSpan={6} className="px-5 py-16 text-center">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Memuat Data Tabel...</span>
                            </td>
                        </tr>
                    ) : displayedData.length > 0 ? (
                        displayedData.map((item, index) => {
                            let confColor = "bg-green-50 text-green-700 border-green-200";
                            let label = "Rendah";
                            if(item.kepercayaan >= 9) {
                                confColor = "bg-red-50 text-red-700 border-red-200";
                                label = "Tinggi";
                            } else if(item.kepercayaan >= 7) {
                                confColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
                                label = "Sedang";
                            }

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-5 py-4 text-center text-slate-400 font-bold text-xs align-top">
                                        {index + 1}
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <div className="font-black text-slate-800 text-sm capitalize">{item.kecamatan.toLowerCase()}</div>
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">{item.kabupaten}</div>
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold border ${confColor} whitespace-nowrap`}>
                                            {label} ({item.kepercayaan})
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600 font-bold text-[11px] hidden md:table-cell align-top uppercase">
                                        {item.satelit}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 font-medium text-xs hidden md:table-cell align-top font-mono">
                                        <div className="flex flex-col">
                                          <span className="text-slate-700 font-bold">{item.waktu}</span>
                                          <span className="text-[9px] text-slate-400">{item.tanggal.split("T")[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-right align-top">
                                        <div className="font-mono text-[11px] font-bold text-slate-500 whitespace-nowrap bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100 group-hover:bg-white transition-colors">
                                            {item.lintang}, {item.bujur}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-5 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                Tidak ada data yang cocok dengan filter
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}