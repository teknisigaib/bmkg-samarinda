"use client";

import { useEffect, useState } from "react";
import { 
  Activity, Database, Globe, RefreshCcw, 
  CheckCircle, XCircle, AlertTriangle, Server
} from "lucide-react";
import { checkSystemHealth, ServiceStatus } from "./actions";

export default function SystemHealthPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const runCheck = async () => {
    setLoading(true);
    try {
      const data = await checkSystemHealth();
      setServices(data);
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    } catch (error) {
      console.error("Gagal cek kesehatan sistem");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
    
    // Auto refresh setiap 60 detik
    const interval = setInterval(runCheck, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    if (status === "UP") return "bg-emerald-50 text-emerald-600 border-emerald-200";
    if (status === "SLOW") return "bg-amber-50 text-amber-600 border-amber-200";
    return "bg-red-50 text-red-600 border-red-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "UP") return <CheckCircle className="w-5 h-5" />;
    if (status === "SLOW") return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            System Health Monitor
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Memantau ketersediaan API Eksternal & Database Internal.
          </p>
        </div>
        <button 
          onClick={runCheck}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Memeriksa..." : "Refresh Status"}
        </button>
      </div>

      {/* GRID STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`relative p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md bg-white`}
          >
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${service.type === 'DATABASE' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                   {service.type === 'DATABASE' ? <Database className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 text-sm">{service.name}</h3>
                   <p className="text-xs text-slate-400 truncate max-w-[150px]">{service.url}</p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(service.status)}`}>
                 {getStatusIcon(service.status)}
                 {service.status === "SLOW" ? "LAMBAT" : service.status === "DOWN" ? "ERROR" : "ONLINE"}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latency</p>
                  <p className={`text-lg font-mono font-bold ${
                      service.latency > 2000 ? "text-amber-600" : service.status === "DOWN" ? "text-red-600" : "text-slate-700"
                  }`}>
                    {service.status === "DOWN" ? "-" : `${service.latency} ms`}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Check</p>
                  <p className="text-sm font-medium text-slate-600">{service.lastCheck}</p>
               </div>
            </div>

            {/* Visual Bar Latency */}
            {service.status !== "DOWN" && (
                <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${
                            service.latency < 500 ? "bg-emerald-500" : service.latency < 2000 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min((service.latency / 3000) * 100, 100)}%` }} // Max bar di 3000ms
                    ></div>
                </div>
            )}
          </div>
        ))}

        {/* Skeleton Loading (Saat pertama load) */}
        {services.length === 0 && loading && [1,2,3,4,5].map((i) => (
             <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                <div className="flex justify-between mb-6">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                    <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
             </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
         <Server className="w-5 h-5 text-blue-600 mt-0.5" />
         <div>
            <h4 className="font-bold text-blue-900 text-sm">Informasi Teknis</h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Dashboard ini melakukan "ping" dari Server BMKG Samarinda ke API target. 
                Jika status <span className="font-bold">ERROR</span>, berarti server kita gagal menghubungi API tersebut (bisa karena API Down atau Server kita tidak ada internet).
                Jika status <span className="font-bold">LAMBAT</span>, berarti respon API lebih dari 2 detik.
            </p>
         </div>
      </div>
    </div>
  );
}