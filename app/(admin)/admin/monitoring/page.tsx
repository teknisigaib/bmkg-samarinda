"use client"; // Diwajibkan oleh Next.js karena file ini menggunakan state interaktif React

import { useState, useEffect } from "react";
import { 
  Activity, Database, RefreshCw, CheckCircle2, Cpu, ServerCrash, 
  Wifi, HardDrive, Network, TerminalSquare, Info 
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { checkDatabaseHealth, checkExternalAPIs, getServerMetrics } from "./actions";

export default function AdminMonitoringPage() {
  const [dbMetric, setDbMetric] = useState({
    status: "Memuat...", responseTime: 0, activeConnections: 0, 
    dbSizeMB: 0, cacheHitRatio: 0, success: true, error: null as string | null
  });
  const [apiMetrics, setApiMetrics] = useState<any[]>([]);
  
  // Initial State Lengkap Berlapis Pengaman Struktur Kosong
  const [serverMetric, setServerMetric] = useState({
    ram: { used: "0", total: "0", percentage: 0 },
    cpu: { load: "0.00", cores: 1, percentage: 0 },
    uptime: "Memuat...", appMemMB: "0", 
    disk: { total: "0", used: "0", percentage: 0 },
    swap: { used: "0", total: "0", percentage: 0 },
    activeSockets: 0,
    network: { rxGB: "0.00", txGB: "0.00" },
    chartData: [] as any[],
    processes: [] as any[],
    systemInfo: { os: "Ubuntu Loading...", kernel: "-", nodeVersion: "-", cpuModel: "-" },
    webStats: { total_views: 0, unique_visitors: 0, top_pages: [] as any[] },
    success: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState("");

  const fetchMetrics = async () => {
    setIsLoading(true);
    const [dbResult, apiResult, serverResult] = await Promise.all([
      checkDatabaseHealth(), checkExternalAPIs(), getServerMetrics()
    ]);
    
    setDbMetric(dbResult);
    setApiMetrics(apiResult);
    if (serverResult) {
      setServerMetric(serverResult as any);
    }

    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLastChecked(now + " WITA");
    setIsLoading(false);
  };

  useEffect(() => { fetchMetrics(); }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 min-h-screen font-sans bg-slate-50/30">
      
      {/* SECTION HEADER CONTROL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> NOC Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Pemantauan Terintegrasi Server Fisik Pusat, Cluster Database, & Endpoint Jaringan.</p>
        </div>
        <button onClick={fetchMetrics} disabled={isLoading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all border border-blue-700">
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> {isLoading ? "Menyinkronkan..." : "Refresh Monitoring"}
        </button>
      </div>

      {/* SECTION 1: HARDWARE MONITORING SYSTEM */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-slate-400" /> 1. Resource Hardware Utama (Ubuntu Server Host)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card RAM */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilisasi RAM Fisik</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.ram?.used || "0"} <span className="text-sm text-slate-400">/ {serverMetric.ram?.total || "0"} GB</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.ram?.percentage > 85 ? 'bg-rose-500' : 'bg-blue-600'}`} style={{ width: `${serverMetric.ram?.percentage || 0}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between">
              <span>Next.js Memory Heap:</span> <span className="text-blue-600 font-mono">{serverMetric.appMemMB || "0"} MB</span>
            </p>
          </div>

          {/* Card SWAP */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RAM Cadangan (SWAP Linux)</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.swap?.used || "0"} <span className="text-sm text-slate-400">/ {serverMetric.swap?.total || "0"} GB</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.swap?.percentage > 40 ? 'bg-orange-500' : 'bg-amber-500'}`} style={{ width: `${serverMetric.swap?.percentage || 0}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
              {(serverMetric.swap?.percentage || 0) > 0 ? `⚠️ Menggunakan ${serverMetric.swap?.percentage}% SWAP!` : "✅ SWAP Kosong (Kondisi Server Ideal)"}
            </p>
          </div>

          {/* Card CPU */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beban Processor (CPU Load)</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.cpu?.load || "0.00"} <span className="text-xs text-slate-400 font-bold">Avg</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.cpu?.percentage > 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${serverMetric.cpu?.percentage || 0}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100">
              Kapasitas Inti: <strong className="text-slate-700">{serverMetric.cpu?.cores || 1} Core CPU</strong> terdeteksi.
            </p>
          </div>

          {/* Card SSD Storage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ruang Penyimpanan SSD (Root)</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.disk?.used || "0"} <span className="text-sm text-slate-400">/ {serverMetric.disk?.total || "0"} GB</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.disk?.percentage > 85 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${serverMetric.disk?.percentage || 0}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
              Sisa Ruang Bebas: <strong className="text-blue-600">{100 - (serverMetric.disk?.percentage || 0)}% Free</strong>
            </p>
          </div>

        </div>
      </div>

      {/* --- SECTION 1.2: AREA CHART & PROCESS RANKING (RECHARTS SINKRONISASI) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kiri: Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" /> Histori Beban Kerja Real-time (aaPanel Engine)
            </span>
            <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full tracking-wider uppercase font-mono animate-pulse">Live Tracking</span>
          </div>

          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serverMetric.chartData || []} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="uiCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="uiLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#uiCpu)" />
                <Area type="monotone" dataKey="load" name="Load Average" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#uiLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kanan: Process Ranking */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <TerminalSquare className="w-4 h-4 text-slate-400" /> Process Resource Ranking (aaPanel Top)
          </span>

          <div className="overflow-x-auto mt-1 grow flex flex-col justify-center">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                  <th className="pb-2">PID</th>
                  <th className="pb-2">Nama Proses</th>
                  <th className="pb-2 text-right">CPU</th>
                  <th className="pb-2 text-right">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
                {(serverMetric.processes || []).map((proc: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 text-slate-400">{proc.pid}</td>
                    <td className="py-2.5 font-bold text-slate-700 truncate max-w-[110px]" title={proc.name}>{proc.name}</td>
                    <td className="py-2.5 text-right text-blue-600 font-bold">{proc.cpu}</td>
                    <td className="py-2.5 text-right text-slate-500">{proc.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SECTION 1.5: ADVANCED NETWORK INTERACTION & BANDWIDTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Bandwidth */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 text-teal-600"><Network className="w-5 h-5"/></div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bandwidth (Akumulasi aaPanel Kartu Jaringan)</span>
              <div className="text-sm font-bold text-slate-700 mt-1 flex gap-5">
                <span>⬇️ Masuk (RX): <strong className="font-mono text-slate-800">{serverMetric.network?.rxGB || "0.00"} GB</strong></span>
                <span>⬆️ Keluar (TX): <strong className="font-mono text-slate-800">{serverMetric.network?.txGB || "0.00"} GB</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Sockets Connections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-purple-600"><Wifi className="w-5 h-5"/></div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sesi Koneksi Terbuka Saat Ini</span>
              <h3 className="text-base font-black text-slate-800 mt-0.5">
                {serverMetric.activeSockets || 0} <span className="text-xs text-slate-400 font-medium">Sockets Terkoneksi Aktif di Port Server</span>
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: SUPABASE STATUS COMPONENT */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-slate-400" /> 2. Kesehatan Database & Pooling (Supabase Cloud Engine)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Latensi</span>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl font-black text-slate-800 uppercase">{dbMetric.status}</h3>
              {dbMetric.success ? (
                <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              ) : <ServerCrash className="w-4 h-4 text-rose-500" />}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volume Penyimpanan DB</span>
            <h3 className="text-xl font-black text-slate-800 mt-1">{dbMetric.dbSizeMB} <span className="text-xs text-slate-400 font-bold">MB</span></h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min((dbMetric.dbSizeMB / 500) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koneksi Sesi Aktif</span>
            <h3 className="text-xl font-black text-slate-800 mt-1">{dbMetric.activeConnections} <span className="text-xs text-slate-400">/ 200 Sesi</span></h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shared Pool Cache Hit</span>
            <h3 className={`text-xl font-black mt-1 ${dbMetric.cacheHitRatio > 95 ? 'text-emerald-600' : 'text-orange-500'}`}>{dbMetric.cacheHitRatio}%</h3>
          </div>
        </div>
      </div>

      {/* SECTION 3: EXTERNAL API PINGER */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-slate-400" /> 3. Jaringan Data BMKG Pusat (Backend Endpoint Pinger)
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {isLoading ? (
               <div className="p-10 flex flex-col items-center justify-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mb-2 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-widest">Menginterogasi API Pusat...</span>
               </div>
            ) : apiMetrics.map((api, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${api.status === 'online' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}><Wifi className="w-4 h-4" /></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{api.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-md">{api.url}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Latensi</span>
                    <span className="text-sm font-mono font-bold text-slate-700">{api.ping} ms</span>
                  </div>
                  <div className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold w-24 border ${api.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    <span className="uppercase text-[10px] font-black">{api.status}</span>
                  </div>
                </div>
              </div>
            )) }
          </div>
        </div>
      </div>

      {/* SECTION 4: WEB TRAFFIC & ANALYTICS FROM SUPABASE */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-slate-400" /> 4. Ringkasan Kunjungan Situs Warga (Live 24 Jam Terakhir)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-600"><Activity className="w-5 h-5"/></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Klik Halaman</span>
                <h3 className="text-2xl font-black text-slate-800 mt-0.5">{serverMetric.webStats?.total_views || 0} <span className="text-xs text-slate-400 font-medium">Hits</span></h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-600"><Wifi className="w-5 h-5"/></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengunjung Unik (Warga)</span>
                <h3 className="text-2xl font-black text-slate-800 mt-0.5">{serverMetric.webStats?.unique_visitors || 0} <span className="text-xs text-slate-400 font-medium">Orang</span></h3>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="bg-slate-50 border-b border-slate-100 p-4 px-5 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">5 Halaman Paling Sering Diakses Hari Ini</span>
              <span className="text-[9px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Top Path</span>
            </div>
            <div className="divide-y divide-slate-100 grow flex flex-col justify-center">
              {serverMetric.webStats?.top_pages?.length === 0 ? (
                <div className="p-10 text-center text-xs font-medium text-slate-400">Belum ada data kunjungan yang terekam masuk dari publik.</div>
              ) : (
                serverMetric.webStats?.top_pages?.map((page: any, idx: number) => (
                  <div key={idx} className="p-3.5 px-5 flex justify-between items-center hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center gap-3 truncate max-w-xs sm:max-w-md">
                      <span className="text-xs font-extrabold text-slate-300 w-4">#{idx + 1}</span>
                      <span className="text-xs font-bold text-slate-700 font-mono truncate bg-slate-50 px-2 py-1 rounded border border-slate-100">{page.path}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-blue-50/50 border border-blue-100/40 px-2 py-1 rounded-lg">
                      {page.hits} <span className="text-[10px] text-slate-400 font-medium">views</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM HARDWARE INFORMATION FOOTER IDENTIFICATION */}
      <div className="bg-slate-800 text-slate-300 rounded-2xl p-5 border border-slate-700 shadow-inner flex flex-col gap-3">
         <div className="flex items-center gap-2 border-b border-slate-700 pb-2 text-white">
            <Info className="w-4 h-4 text-blue-400"/>
            <span className="text-xs font-black uppercase tracking-wider">Identifikasi Spesifikasi Unit Node Server</span>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div>⚙️ OS Host: <strong className="text-white">{serverMetric.systemInfo?.os || "-"}</strong></div>
            <div>🐧 Core Engine: <strong className="text-white">{serverMetric.systemInfo?.kernel || "-"}</strong></div>
            <div>🟢 Node.js: <strong className="text-white">{serverMetric.systemInfo?.nodeVersion || "-"}</strong></div>
            <div className="truncate">🧠 CPU Model: <strong className="text-white" title={serverMetric.systemInfo?.cpuModel}>{serverMetric.systemInfo?.cpuModel || "-"}</strong></div>
         </div>
         <div className="text-right text-[9px] text-slate-500 font-bold uppercase tracking-wider border-t border-slate-700/50 pt-2">
            Uptime Terakhir: {serverMetric.uptime || "-"} • Sinkronisasi: {lastChecked || "--:--"}
         </div>
      </div>

    </div>
  );
}