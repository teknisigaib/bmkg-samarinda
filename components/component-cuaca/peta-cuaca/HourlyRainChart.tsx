"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { CloudRain, Loader2, Droplets, AlertCircle } from "lucide-react";

interface HourlyRainChartProps {
  stationName: string;
}

// 👉 HELPER: Logika Warna Pastel Berdasarkan Intensitas Hujan
const getRainColor = (rain: number) => {
  if (rain === 0) return "#e2e8f0"; 
  if (rain > 0 && rain <= 1) return "#93c5fd"; 
  if (rain > 1 && rain <= 5) return "#86efac"; 
  if (rain > 5 && rain <= 10) return "#fde047"; 
  if (rain > 10 && rain <= 20) return "#fdba74"; 
  if (rain > 20) return "#fca5a5"; 
  return "#e2e8f0";
};

const getRainStatusLabel = (rain: number) => {
  if (rain === 0) return "Tidak Hujan";
  if (rain > 0 && rain <= 1) return "Sangat Ringan";
  if (rain > 1 && rain <= 5) return "Ringan";
  if (rain > 5 && rain <= 10) return "Sedang";
  if (rain > 10 && rain <= 20) return "Lebat";
  if (rain > 20) return "Sangat Lebat";
  return "-";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const rainValue = payload[0].value;
    const dotColor = getRainColor(rainValue);
    const statusLabel = getRainStatusLabel(rainValue);

    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-3 min-w-[140px] animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 border-b border-slate-100 pb-1">{label} WITA</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }}></div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">{statusLabel}</span>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-700">
            {rainValue} <span className="text-[9px] font-semibold text-slate-400 uppercase">mm</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function HourlyRainChart({ stationName }: HourlyRainChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalRain, setTotalRain] = useState(0);

  useEffect(() => {
    // 👉 FUNGSI FETCH API ASLI BMKG
    const fetchRealData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        // Panggil API backend yang Anda berikan
        const apiUrl = `https://rain.bmkgaptpranoto.com/api/grafik-intensitas?stationName=${encodeURIComponent(stationName)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error("Gagal merespon dari server API");
        }

        const result = await response.json();

        // Format data sesuai JSON dari backend
        // result.chart_data berisi array object [{ hour: "15:00", rain: 0 }, ...]
        const formattedData = result.chart_data.map((item: any) => ({
          time: item.hour,
          rain: parseFloat(item.rain || 0)
        }));

        setData(formattedData);

        // Ambil nilai total_24h langsung dari JSON (tidak perlu dihitung manual)
        setTotalRain(parseFloat(result.total_24h || 0));

      } catch (error) {
        console.error("Error fetching rain data:", error);
        setIsError(true);
        setData([]); 
        setTotalRain(0);
      } finally {
        setIsLoading(false);
      }
    };

    // Eksekusi pemanggilan data
    if (stationName) {
      fetchRealData();
    }
  }, [stationName]);

  return (
    <div className="flex flex-col w-full h-full">
      
      {/* HEADER: Akumulasi Total */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-400">
            <Droplets size={16} />
          </div>
          <div>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Akumulasi Harian</p>
            <p className="text-xs font-bold text-slate-700 leading-tight">24 Jam Terakhir</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-slate-700">{isLoading || isError ? "-" : totalRain}</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase ml-1">mm</span>
        </div>
      </div>

      {/* KONTAINER GRAFIK */}
      <div className="flex-1 w-full min-h-[160px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400 gap-2 bg-white/50 backdrop-blur-sm z-10 rounded-xl">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Menarik Data...</span>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 gap-2">
            <AlertCircle size={24} className="opacity-70" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Gagal Memuat Data</span>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
            <CloudRain size={24} className="opacity-50" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Tidak ada observasi</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 400 }}
                dy={10}
                minTickGap={20} 
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 400 }} 
                dx={-10}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: '#f1f5f9' }} 
              />
              
              <Bar 
                dataKey="rain" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40} 
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getRainColor(entry.rain)} 
                    className="transition-all duration-300 hover:brightness-95 cursor-pointer"
                  />
                ))}
                <LabelList 
                  dataKey="rain" 
                  position="top" 
                  offset={8}
                  fontSize={8}
                  fontWeight={400}
                  fill="#64748b" 
                  formatter={(value) => typeof value === "number" && value > 0 ? value.toFixed(1) : "" } 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* LEGENDA INTENSITAS */}
      {!isLoading && !isError && data.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center shrink-0 animate-in fade-in duration-500">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2.5 px-1">
            Intensitas (mm/jam)
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-300"></div>
              <span className="text-[9px] font-medium text-slate-500">&le; 1 (S. Ringan)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-green-300"></div>
              <span className="text-[9px] font-medium text-slate-500">1-5 (Ringan)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-yellow-300"></div>
              <span className="text-[9px] font-medium text-slate-500">5-10 (Sedang)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-orange-300"></div>
              <span className="text-[9px] font-medium text-slate-500">10-20 (Lebat)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-red-300"></div>
              <span className="text-[9px] font-medium text-slate-500">&gt; 20 (S. Lebat)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}