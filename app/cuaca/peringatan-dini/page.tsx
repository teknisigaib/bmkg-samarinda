import { AlertTriangle, Clock, MapPin, Info, FileText } from "lucide-react";
import { getLinkPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getCAPAlertDetail } from "@/lib/bmkg/cap";
import MapLoader from "@/components/component-cuaca/peringatan-dini/MapLoader"; // <--- Import Loader (bukan dynamic)

// Helper format tanggal
const formatDate = (isoStr: string) => {
    if(!isoStr) return "-";
    try {
        return new Date(isoStr).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Makassar",
            hour12: false
        }) + " WITA";
    } catch (e) { return isoStr; }
};

export default async function PeringatanPage() {
  // 1. Ambil Link dari RSS
  const xmlLink = await getLinkPeringatanDiniKaltim();
  
  // 2. Jika ada link, ambil detailnya. Jika tidak, null.
  const alertData = xmlLink ? await getCAPAlertDetail(xmlLink) : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <AlertTriangle className={`w-8 h-8 ${alertData ? 'text-red-600' : 'text-green-600'}`} />
                Peringatan Dini Cuaca
            </h1>
            <p className="text-gray-500">
                Data resmi dari Nowcasting BMKG untuk wilayah Kalimantan Timur.
            </p>
        </div>

        {/* KONDISI 1: AMAN (Tidak ada data) */}
        {!alertData && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Cuaca Baik</h3>
                <p className="text-green-700 mt-2">
                    Saat ini tidak terpantau adanya peringatan dini cuaca signifikan di wilayah Kalimantan Timur.
                </p>
            </div>
        )}

        {/* KONDISI 2: BAHAYA (Ada data) */}
        {alertData && (
            <div className="space-y-6">
                
                {/* CARD UTAMA */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${alertData.severity === 'Severe' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Tingkat: {alertData.severity}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                            {alertData.event}
                        </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                        {alertData.headline}
                    </h2>

                    {/* MAP VISUALIZATION - MENGGUNAKAN MAP LOADER */}
                    <div className="mb-6 relative z-0">
                        <MapLoader data={{ polygons: alertData.polygons, severity: alertData.severity }} />
                        <p className="text-center text-xs text-gray-400 mt-2">
                            *Area berwarna adalah wilayah terdampak langsung
                        </p>
                    </div>

                    {/* DETAIL TEXT */}
                    <div className="gap-6 text-md">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-blue-500" /> Waktu Berlaku
                                </h4>
                                <p className="text-gray-600 ml-6">
                                    {formatDate(alertData.effective)} s/d  
                                    <span className="font-semibold text-gray-800">{formatDate(alertData.expires)}</span>
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                                    <FileText className="w-4 h-4 text-blue-500" /> Deskripsi Lengkap
                                </h4>
                                <p className="text-gray-600 ml-6 leading-relaxed text-justify">
                                    {alertData.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )}

      </div>
    </div>
  );
}