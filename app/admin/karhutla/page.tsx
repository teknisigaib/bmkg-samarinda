"use client";

import { useState } from "react";
import { importHotspots, clearHotspots } from "@/lib/data-karhutla";
import { Flame, Trash2, Save, AlertCircle } from "lucide-react";

export default function AdminKarhutlaPage() {
  const [rawData, setRawData] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{success?: boolean; msg?: string} | null>(null);

  const handleImport = async () => {
    if (!rawData.trim()) return;
    setLoading(true);
    setStatus(null);

    const res = await importHotspots(rawData);
    
    if (res.success) {
        setStatus({ success: true, msg: `Berhasil import ${res.count} titik hotspot!` });
        setRawData(""); // Clear form
    } else {
        setStatus({ success: false, msg: res.msg });
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (confirm("Hapus SEMUA data hotspot di database?")) {
        setLoading(true);
        await clearHotspots();
        setStatus({ success: true, msg: "Database hotspot berhasil dikosongkan." });
        setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Input Data Hotspot</h1>
          <p className="text-gray-500 text-sm">Copy data dari Excel/Sipongi lalu Paste di sini.</p>
        </div>
        <button onClick={handleClear} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Trash2 className="w-4 h-4" /> Reset Database
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-bold text-gray-700 mb-2">Paste Data Mentah (Format TSV/Excel)</label>
        <div className="text-xs text-gray-400 mb-2 font-mono bg-gray-50 p-2 rounded border border-gray-100">
            Format Kolom: Longitude | Latitude | Confidence | ... | Provinsi | Kabupaten | Kecamatan | Satelit | Tanggal ...
        </div>
        
        <textarea 
            className="w-full h-64 p-4 border border-gray-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-red-500 outline-none"
            placeholder={`115.8634\t-1.8901\t8\tKALIMANTAN\tKALIMANTAN TIMUR...`}
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
        ></textarea>

        {status && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <AlertCircle className="w-4 h-4" />
                {status.msg}
            </div>
        )}

        <div className="mt-4 flex justify-end">
            <button 
                onClick={handleImport} 
                disabled={loading || !rawData}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:bg-gray-300 transition-all shadow-lg shadow-red-200"
            >
                {loading ? "Memproses..." : <><Save className="w-4 h-4" /> Proses Data</>}
            </button>
        </div>
      </div>
    </div>
  );
}