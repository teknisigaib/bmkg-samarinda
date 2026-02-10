import { getGempaDirasakanList } from "@/lib/bmkg/gempa";
import { MapPin, Calendar, Clock, Radio } from "lucide-react";

export const revalidate = 60;

export default async function GempaDirasakanPage() {
  const data = await getGempaDirasakanList();

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {data.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row gap-6">
                
                {/* Kolom Kiri */}
                <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-2 md:w-32 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                    <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Magnitudo</div>
                        <div className="text-3xl font-extrabold text-orange-600">{item.Magnitude}</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200 md:w-10 md:h-px"></div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Kedalaman</div>
                        <div className="text-lg font-bold text-gray-700">{item.Kedalaman}</div>
                    </div>
                </div>

                {/* Kolom Tengah */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {item.Tanggal}</div>
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.Jam}</div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900">
                        {item.Wilayah}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{item.Lintang}, {item.Bujur}</span>
                    </div>

                    {/* Dirasakan (MMI) */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mt-2">
                        <div className="flex items-center gap-2 mb-1 text-orange-600 text-xs font-bold uppercase tracking-wider">
                            <Radio className="w-3 h-3" /> Dirasakan (MMI)
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {item.Dirasakan}
                        </p>
                    </div>
                </div>

            </div>
        ))}
      </div>

    </div>
  );
}