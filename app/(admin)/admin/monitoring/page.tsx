"use client";

import { useState, useEffect } from "react";
import { 
  Activity, Database, RefreshCw, CheckCircle2, 
  AlertTriangle, Cpu, ServerCrash, Clock, Wifi, XCircle
} from "lucide-react";
import { checkDatabaseHealth, checkExternalAPIs, getServerMetrics } from "./actions";

export default function AdminMonitoringPage() {
  const [dbMetric, setDbMetric] = useState({
    status: "Memuat...", responseTime: 0, activeConnections: 0, 
    dbSizeMB: 0,
    cacheHitRatio: 0,
    success: true,
    error: null as string | null
  });
  const [apiMetrics, setApiMetrics] = useState<any[]>([]);
  const [serverMetric, setServerMetric] = useState({
    ram: { used: "0", total: "0", percentage: 0 },
    cpu: { load: "0.00", cores: 1, percentage: 0 },
    uptime: "Memuat...", 
    appMemMB: "0", 
    disk: { total: "0", used: "0", percentage: 0 },
    swap: { used: "0", total: "0", percentage: 0 }, // 👈 PASTIKAN INI ADA
    activeSockets: 0,                               // 👈 PASTIKAN INI ADA
    success: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState("");

  const fetchMetrics = async () => {
    setIsLoading(true);
    // Jalankan semua pengecekan secara paralel biar wuss-wuss!
    const [dbResult, apiResult, serverResult] = await Promise.all([
      checkDatabaseHealth(), 
      checkExternalAPIs(), 
      getServerMetrics()
    ]);
    
    setDbMetric(dbResult);
    setApiMetrics(apiResult);
    if (serverResult.success) {
      setServerMetric(serverResult as any);
    }

    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLastChecked(now + " WITA");
    setIsLoading(false);
  };

  useEffect(() => { 
    fetchMetrics(); 
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 min-h-screen">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> Full-Stack Core Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-1">Memantau Ubuntu Server v24 Pusat, Performa Supabase, & Kesehatan Jaringan API.</p>
        </div>
        <button 
          onClick={fetchMetrics} 
          disabled={isLoading} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all border border-blue-700"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> 
          {isLoading ? "Sinkronisasi..." : "Refresh Data"}
        </button>
      </div>

      {/* SECTION 1: UBUNTU RESOURCE */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Pemantauan Hardware OS & Network (Ubuntu v24 Local Host)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: RAM & App Heap */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilisasi RAM OS</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.ram.used} <span className="text-sm text-slate-400">/ {serverMetric.ram.total} GB</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.ram.percentage > 85 ? 'bg-rose-500' : 'bg-indigo-600'}`} style={{ width: `${serverMetric.ram.percentage}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between">
              <span>Next.js App Memory:</span> <strong className="text-indigo-600">{serverMetric.appMemMB} MB</strong>
            </p>
          </div>

          {/* Card 2: SWAP Memory (RAM Cadangan) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alokasi Virtual SWAP Linux</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.swap.used} <span className="text-sm text-slate-400">/ {serverMetric.swap.total} GB</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.swap.percentage > 50 ? 'bg-orange-500' : 'bg-amber-500'}`} style={{ width: `${serverMetric.swap.percentage}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              {serverMetric.swap.percentage > 0 ? `⚠️ Sistem menggunakan ${serverMetric.swap.percentage}% RAM Cadangan SSD!` : "✅ Penggunaan SWAP: 0% (Kondisi Ideal)"}
            </p>
          </div>

          {/* Card 3: CPU Load */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beban CPU (Load Avg)</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.cpu.load} <span className="text-xs text-slate-400 font-bold">Avg (1m)</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.cpu.percentage > 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${serverMetric.cpu.percentage}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
              Kapasitas: <strong className="text-slate-700">{serverMetric.cpu.cores} Core</strong> inti terdeteksi pada ACPI.
            </p>
          </div>

          {/* Card 4: SSD Storage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kapasitas SSD (Root /)</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{serverMetric.disk.used} <span className="text-sm text-slate-400">/ {serverMetric.disk.total} GB</span></h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${serverMetric.disk.percentage > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${serverMetric.disk.percentage}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
              Sisa Ruang: <strong className={serverMetric.disk.percentage > 90 ? "text-rose-600" : "text-blue-600"}>{100 - serverMetric.disk.percentage}% Free</strong>
            </p>
          </div>

          {/* Card 5: Jaringan Sockets (Traffic Monitor) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koneksi TCP Jaringan (HTTP/S)</span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {serverMetric.activeSockets} <span className="text-sm font-bold text-slate-400">Koneksi Aktif</span>
              </h3>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
              Membaca port operasional Linux via subsistem <code className="bg-slate-200 px-1 rounded font-mono">ss</code> CLI.
            </p>
          </div>

          {/* Card 6: Uptime */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Uptime</span>
              <h3 className="text-xl font-black text-slate-800 mt-1">{serverMetric.uptime}</h3>
            </div>
            <div className="text-[10px] font-bold text-slate-500 bg-emerald-50 border border-emerald-100 p-2 rounded-xl mt-3 flex justify-between items-center">
              <span>Status OS:</span> 
              <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> ONLINE</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: SUPABASE */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Kesehatan Database & Pooling (Supabase Engine)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Latensi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Latensi</span>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl font-black text-slate-800 uppercase">{dbMetric.status}</h3>
              {dbMetric.success ? (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbMetric.status === 'Stabil' ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dbMetric.status === 'Stabil' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                </span>
              ) : <ServerCrash className="w-4 h-4 text-rose-500" />}
            </div>
          </div>
          {/* Storage Volume */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volume DB (Max 500MB)</span>
            <h3 className="text-xl font-black text-slate-800 mt-1">{dbMetric.dbSizeMB} <span className="text-xs text-slate-400 font-bold">MB</span></h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${dbMetric.dbSizeMB > 400 ? 'bg-rose-500' : 'bg-blue-600'}`} style={{ width: `${Math.min((dbMetric.dbSizeMB / 500) * 100, 100)}%` }}></div>
            </div>
          </div>
          {/* Koneksi Aktif */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koneksi Sesi Aktif</span>
            <h3 className="text-xl font-black text-slate-800 mt-1">{dbMetric.activeConnections} <span className="text-xs text-slate-400">/ 200 Sesi</span></h3>
          </div>
          {/* Cache Hit Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buffer Cache Hit Rate</span>
            <h3 className={`text-xl font-black mt-1 ${dbMetric.cacheHitRatio > 95 ? 'text-emerald-600' : 'text-orange-500'}`}>{dbMetric.cacheHitRatio}%</h3>
          </div>
        </div>
      </div>

      {/* SECTION 3: EXTERNAL API */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">3. Uji Konektivitas API BMKG Pusat (Backend Endpoint Pinger)</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {isLoading ? (
               <div className="p-10 flex flex-col items-center justify-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mb-2 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-widest">Menginterogasi API Pusat...</span>
               </div>
            ) : apiMetrics.map((api, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${api.status === 'online' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : api.status === 'timeout' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{api.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-md">{api.url}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Latensi Server</span>
                    <span className={`text-sm font-mono font-bold ${api.ping > 2500 ? 'text-orange-500' : 'text-slate-700'}`}>{api.ping} ms</span>
                  </div>
                  <div className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold w-24 border ${api.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : api.status === 'timeout' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    {api.status === 'online' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span className="uppercase text-[10px] tracking-wide">{api.status}</span>
                  </div>
                </div>
              </div>
            )) }
          </div>
          <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
             <span className="text-[10px] font-medium text-slate-400">Pengecekan diisolasi penuh di layer backend untuk mereduksi overhead beban memori browser klien.</span>
             <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Sinkronisasi Terakhir: {lastChecked || "--:--"}</span>
          </div>
        </div>
      </div>

      {/* ERROR CONDITIONAL PANEL */}
      {!dbMetric.success && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-rose-800 text-sm uppercase tracking-wider">Subsistem Mengalami Gangguan!</h4>
            <p className="text-xs font-medium text-rose-600 mt-1">Pesan Kesalahan: <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono text-rose-700 text-[10px]">{dbMetric.error}</code></p>
          </div>
        </div>
      )}
    </div>
  );
}