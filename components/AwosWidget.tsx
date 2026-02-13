import { Clock, Plane, WifiOff, Activity } from "lucide-react";
import { getAwosFullData } from "@/lib/awos";
import AwosVisualizer from "./AwosVisualizer"; 

export default async function AwosWidget() {
  const fullData = await getAwosFullData();

  if (!fullData) {
    return (
      <div className="bg-slate-50 rounded-[1.5rem] p-8 border border-slate-200 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <WifiOff className="w-10 h-10 text-slate-300 mb-3" />
        <h3 className="text-slate-600 font-bold">Koneksi AWOS Terputus</h3>
        <p className="text-slate-400 text-xs mt-1">Gagal menghubungi sensor landasan.</p>
      </div>
    );
  }

  const lastUpdate = fullData.last_update 
    ? new Date(fullData.last_update).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' }) 
    : "--:--";

  return (
    <div className="flex flex-col gap-4">
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between px-2 pt-1">
            <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-600" />
                    Live Data Landasan
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-600">WALS - APT Pranoto</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>AWOS System</span>
                </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-600">
                    {lastUpdate} WITA
                </span>
            </div>
        </div>

        {/* VISUALIZER */}
        <AwosVisualizer fullData={fullData} />
    </div>
  );
}