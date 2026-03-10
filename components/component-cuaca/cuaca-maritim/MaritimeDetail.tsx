"use client";
import { 
  X, Info, Waves, Wind, Thermometer, 
  Navigation, Eye, ArrowDownUp, Calendar, Navigation2 
} from "lucide-react";
import { getWaveColor, getWindRotation } from "@/lib/bmkg/maritim";

interface Props {
  data: any;
  onClose: () => void;
}

export default function MaritimeDetail({ data, onClose }: Props) {
  const isPort = data.type === 'port';
  
  // Format Waktu (WITA)
  const formattedTime = new Date(data.time).toLocaleString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', 
    hour: '2-digit', minute: '2-digit', 
    timeZone: 'Asia/Makassar' 
  });

  return (
    <div className="absolute top-4 right-4 z-[1001] w-72 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300 animate-in slide-in-from-right-4">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
             <Info className="w-3 h-3" /> INFO {isPort ? 'PELABUHAN' : 'PERAIRAN'}
        </h4>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div>
        <div className="text-blue-900 font-bold leading-tight text-sm mb-1">
            {data.name}
        </div>
        <div className="text-gray-500 text-[10px] font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formattedTime} WITA
        </div>
        
        <div className="flex flex-col gap-2">
            
            {/* 1. Kondisi Cuaca */}
            <div className="items-center justify-center text-xs p-2 rounded-lg bg-slate-100">
               <span className="font-bold items-center justify-center gap-1.5 text-center">
                  {data.weather}
               </span>
            </div>

            {/* 2. Gelombang / Pasang Surut */}
            <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
               <span className="text-gray-500 flex items-center gap-1">
                  {isPort ? <ArrowDownUp size={12}/> : <Waves size={12}/>}
                  {isPort ? 'Pasang Surut:' : 'Gelombang:'}
               </span>
               {isPort ? (
                  <span className="font-bold text-gray-700">{data.tides ?? '-'} m</span>
               ) : (
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] uppercase text-white shadow-sm"
                        style={{ backgroundColor: getWaveColor(data.wave_cat) }}>
                      {data.wave_cat} ({data.wave_height}m)
                  </span>
               )}
            </div>

            {/* 3. Angin (Dengan Ikon Rotasi) */}
            <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
               <span className="text-gray-500 flex items-center gap-1">
                  <Wind size={12}/> Angin:
               </span>
               
               <div className="flex items-center gap-2">
                   <div className="text-right">
                       <span className="font-medium text-gray-700">{data.wind_speed} kts</span>
                       <div className="text-[9px] text-gray-400">Dari {data.wind_from}</div>
                   </div>
                   <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex items-center justify-center w-6 h-6">
                      <Navigation2 
                          size={12} 
                          className="text-blue-500 transition-transform duration-500 ease-out"
                          style={{ transform: `rotate(${getWindRotation(data.wind_from)}deg)` }}
                      />
                   </div>
               </div>
            </div>

            {/* 4. Visibilitas / Arus (UPDATE: Ikon Rotasi Arus Laut) */}
            <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
               <span className="text-gray-500 flex items-center gap-1">
                  {isPort ? <Eye size={12}/> : <Navigation size={12}/>}
                  {isPort ? 'Jarak Pandang:' : 'Arus Laut:'}
               </span>
               {isPort ? (
                   <span className="font-medium text-gray-700">{data.visibility ?? '-'} km</span>
               ) : (
                   <div className="flex items-center gap-2">
                       <div className="text-right">
                           <span className="font-medium text-gray-700">{data.current_speed} cm/s</span>
                           <div className="text-[9px] text-emerald-600 font-bold">Ke {data.current_to}</div>
                       </div>
                       
                       {/* Ikon Rotasi Arus Laut */}
                       <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex items-center justify-center w-6 h-6">
                          <Navigation2 
                              size={12} 
                              className="text-emerald-500 transition-transform duration-500 ease-out"
                              style={{ transform: `rotate(${getWindRotation(data.current_to)}deg)` }}
                          />
                       </div>
                   </div>
               )}
            </div>
            
            {/* 5. Stats Box */}
            <div className="flex flex-col gap-1 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 mt-1">
               <div className="flex items-center gap-1 text-gray-500 mb-1 text-[10px] uppercase tracking-wide">
                 <Thermometer className="w-3 h-3" /> Suhu & RH
               </div>
               <div className="flex justify-between text-[11px] text-gray-600 font-semibold px-1">
                 <span>Suhu: {data.temp_avg}°C</span>
                 <span>RH: {data.rh_avg}%</span>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
}