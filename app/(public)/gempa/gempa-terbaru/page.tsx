import Image from "next/image";
import { getGempaTerbaru, getGempaTerkiniList } from "@/lib/bmkg/gempa";
import { MapPin, Calendar, Activity, Waves, Clock } from "lucide-react";

export const revalidate = 60; 

export default async function GempaTerbaruPage() {
  const [autoGempa, listGempa] = await Promise.all([
    getGempaTerbaru(),
    getGempaTerkiniList()
  ]);

  return (
    <div className="space-y-12 w-full">
      
      {/* --- 1. HERO: GEMPA MUTAKHIR --- */}
      {autoGempa && (
        <section>
          <div className="bg-gradient-to-br  border border-red-100 rounded-3xl p-5 md:p-8 flex flex-col lg:flex-row gap-8 items-center shadow-sm">
                
                {/* Peta Shakemap (Responsive Aspect Ratio) */}
                <div className="w-full lg:w-1/3 relative aspect-square md:aspect-video lg:aspect-[3/4] rounded-2xl overflow-hidden border border-red-100 shadow-md group">
                    {autoGempa.ShakemapUrl ? (
                        <Image 
                            src={autoGempa.ShakemapUrl} 
                            alt="Peta Guncangan" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">No Map</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-center backdrop-blur-sm">
                        Shakemap BMKG
                    </div>
                </div>

                {/* Detail Gempa */}
                <div className="flex-1 w-full space-y-6">
                    <div className="text-center lg:text-left">
                        <div className="text-sm text-gray-500 mb-1 font-medium flex items-center justify-center lg:justify-start gap-2">
                            <Calendar className="w-4 h-4" /> {autoGempa.Tanggal} 
                            <span className="hidden md:inline">•</span> 
                            <Clock className="w-4 h-4 ml-2 md:ml-0" /> {autoGempa.Jam}
                        </div>
                        <h3 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight mt-2">{autoGempa.Wilayah}</h3>
                    </div>

                    {/* Grid Info Utama (Mobile Friendly) */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm text-center">
                            <div className="text-[10px] md:text-xs text-gray-500 uppercase font-bold mb-1">Magnitudo</div>
                            <div className="text-2xl md:text-4xl font-bold text-red-600">{autoGempa.Magnitude}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm text-center">
                            <div className="text-[10px] md:text-xs text-gray-500 uppercase font-bold mb-1">Kedalaman</div>
                            <div className="text-2xl md:text-3xl font-bold text-gray-800">{autoGempa.Kedalaman}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm text-center col-span-2">
                            <div className="text-[10px] md:text-xs text-gray-500 uppercase font-bold mb-1">Koordinat</div>
                            <div className="text-lg md:text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                {autoGempa.Lintang} - {autoGempa.Bujur}
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left ${
                        autoGempa.Potensi?.toLowerCase().includes("tidak") 
                        ? "bg-green-50 border-green-200 text-green-800" 
                        : "bg-red-50 border-red-200 text-red-800 animate-pulse"
                    }`}>
                        <Waves className="w-6 h-6 flex-shrink-0" />
                        <span className="font-bold text-sm md:text-base">{autoGempa.Potensi}</span>
                    </div>
                    
                    {autoGempa.Dirasakan && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center lg:text-left">
                            <span className="font-bold text-gray-800 block mb-1">Dirasakan (MMI):</span> 
                            {autoGempa.Dirasakan}
                        </div>
                    )}
                </div>
            </div>
        </section>
      )}

      {/* --- 2. LIST GEMPA TERKINI --- */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
            <Activity className="w-5 h-5 text-red-600" />
            15 Gempabumi Terkini (M ≥ 5.0)
        </h2>
        
        {/* A. TAMPILAN DESKTOP (TABLE) - Hidden di Mobile */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                        <th className="p-4 whitespace-nowrap">Waktu Gempa</th>
                        <th className="p-4 text-center">Mag</th>
                        <th className="p-4 text-center">Dalam</th>
                        <th className="p-4">Lokasi Pusat Gempa</th>
                        <th className="p-4">Potensi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {listGempa.map((item, idx) => (
                        <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                            <td className="p-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{item.Tanggal}</div>
                                <div className="text-xs text-gray-500">{item.Jam}</div>
                            </td>
                            <td className="p-4 text-center">
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{item.Magnitude}</span>
                            </td>
                            <td className="p-4 text-center text-gray-600">{item.Kedalaman}</td>
                            <td className="p-4">
                                <div className="font-medium text-gray-800 mb-1 line-clamp-1" title={item.Wilayah}>{item.Wilayah}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {item.Lintang}, {item.Bujur}
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`text-xs px-2 py-1 rounded border inline-block whitespace-nowrap ${
                                    item.Potensi?.toLowerCase().includes("tidak") 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                    {item.Potensi?.replace("berpotensi ", "")}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* B. TAMPILAN MOBILE (CARD LIST) - Hidden di Desktop */}
        <div className="md:hidden space-y-4">
            {listGempa.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                    {/* Header Card: Mag & Waktu */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-100 text-red-700 w-12 h-12 flex flex-col items-center justify-center rounded-lg border border-red-200">
                                <span className="text-xs font-bold uppercase">Mag</span>
                                <span className="text-lg font-extrabold">{item.Magnitude}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{item.Tanggal}</p>
                                <p className="text-xs text-gray-500">{item.Jam}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-gray-400 font-bold uppercase">Dalam</span>
                            <span className="text-sm font-bold text-gray-700">{item.Kedalaman}</span>
                        </div>
                    </div>

                    {/* Lokasi */}
                    <div className="border-t border-gray-100 pt-3">
                        <p className="text-sm font-medium text-gray-800 mb-1">{item.Wilayah}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.Lintang}, {item.Bujur}
                        </p>
                    </div>

                    {/* Potensi (Badge) */}
                    <div className={`text-xs px-3 py-2 rounded-lg font-medium text-center ${
                        item.Potensi?.toLowerCase().includes("tidak") 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                        {item.Potensi}
                    </div>
                </div>
            ))}
        </div>

      </section>

    </div>
  );
}