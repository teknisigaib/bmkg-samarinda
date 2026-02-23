"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  CloudRain, Sun, Save, RotateCcw, FileText, Plus, Calendar, Loader2, Image as ImageIcon
} from "lucide-react";
import { 
  getPdieData, updateRegionStatus, updatePeriodeLabel, resetAllRegions, uploadDocument 
} from "./actions"; // deleteDocument dihapus

import { supabase } from "@/lib/supabase";
import imageCompression from 'browser-image-compression'; 
import GlobalDeleteButton from "@/components/component-admin/GlobalDeleteButton"; // IMPORT TOMBOL GLOBAL

type WarningLevel = "AWAS" | "SIAGA" | "WASPADA" | "AMAN";

interface RegionData {
  id: string;
  name: string;
  rainLevel: WarningLevel;
  droughtLevel: WarningLevel;
}

interface DokumenItem {
  id: string;
  title: string;
  date: string;
  type: string;
  fileUrl: string; 
  filePath: string; 
}

const getStatusColor = (level: string) => {
  switch (level) {
    case "AWAS": return "bg-red-100 text-red-700 border-red-200 ring-red-500";
    case "SIAGA": return "bg-orange-100 text-orange-700 border-orange-200 ring-orange-500";
    case "WASPADA": return "bg-yellow-100 text-yellow-700 border-yellow-200 ring-yellow-500";
    case "AMAN": return "bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const sanitizeFileName = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
};

export default function AdminPeringatanPage() {
  const [activeTab, setActiveTab] = useState<"HUJAN" | "KEKERINGAN">("HUJAN");
  const [isPending, startTransition] = useTransition(); 
  const [isLoading, setIsLoading] = useState(true);

  const [regions, setRegions] = useState<RegionData[]>([]);
  const [periodeLabel, setPeriodeLabel] = useState("");
  const [documents, setDocuments] = useState<DokumenItem[]>([]);
  
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [isUploadingFile, setIsUploadingFile] = useState(false); 
  
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});

  const loadLocalData = async () => {
    try {
        const data = await getPdieData();
        // @ts-ignore
        setRegions(data.regions);
        setPeriodeLabel(data.periodeLabel);
        // @ts-ignore
        setDocuments(data.documents);
    } catch (e) {
        console.error("Gagal ambil data", e);
    }
  };

  useEffect(() => {
    async function initData() {
      await loadLocalData();
      setIsLoading(false);
    }
    initData();
  }, []);

  const handleStatusChange = async (id: string, newLevel: WarningLevel) => {
    const previousRegions = [...regions];

    setRegions(prev => prev.map(r => r.id === id ? {
       ...r, 
       rainLevel: activeTab === "HUJAN" ? newLevel : r.rainLevel,
       droughtLevel: activeTab === "KEKERINGAN" ? newLevel : r.droughtLevel
    } : r));

    setUpdatingItems(prev => ({ ...prev, [id]: true }));

    try {
        await updateRegionStatus(id, activeTab, newLevel);
    } catch (err) {
        console.error(err);
        alert("Gagal mengupdate status.");
        setRegions(previousRegions);
    } finally {
        setTimeout(() => {
            setUpdatingItems(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }, 500);
    }
  };

  const handleSaveLabel = () => {
    startTransition(async () => {
      await updatePeriodeLabel(periodeLabel);
    });
  };

  const handleResetAll = () => {
    if (confirm(`Yakin reset semua status ${activeTab} menjadi AMAN?`)) {
      startTransition(async () => {
        await resetAllRegions(activeTab);
        await loadLocalData();
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return alert("Pilih file dan isi judul!");
    if (uploadFile.size > 10 * 1024 * 1024) return alert("Ukuran file maksimal 10MB.");

    setIsUploadingFile(true);

    try {
        let finalFileToUpload = uploadFile;
        let fileExtension = uploadFile.name.split('.').pop()?.toLowerCase();
        let mimeType = uploadFile.type;
        const cleanTitle = sanitizeFileName(uploadTitle);
        const timestamp = Date.now().toString().slice(-4);

        if (uploadFile.type.startsWith("image/")) {
            const compressed = await imageCompression(uploadFile, {
                maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, fileType: "image/webp"
            });
            finalFileToUpload = compressed;
            fileExtension = "webp";
            mimeType = "image/webp";
        }

        const folderTab = activeTab.toLowerCase();
        const filePath = `pdie/${folderTab}/${cleanTitle}-${timestamp}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
            .from("bmkg-public")
            .upload(filePath, finalFileToUpload, {
                contentType: mimeType,
                upsert: false
            });

        if (uploadError) throw new Error("Gagal upload ke Storage: " + uploadError.message);

        const { data: { publicUrl } } = supabase.storage.from("bmkg-public").getPublicUrl(filePath);
        
        const fileSizeMB = (finalFileToUpload.size / (1024 * 1024)).toFixed(1) + " MB";
        const todayDate = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

        await uploadDocument(uploadTitle, activeTab, todayDate, publicUrl, filePath, fileSizeMB);

        setUploadFile(null);
        setUploadTitle("");
        
        const fileInput = document.getElementById('pdie-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = "";

        await loadLocalData();
        
    } catch (e: any) {
        console.error(e);
        alert(e.message || "Gagal upload file.");
    } finally {
        setIsUploadingFile(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500 gap-2"><Loader2 className="animate-spin" /> Memuat Data Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Peringatan Dini</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola status peringatan dini hujan & kekeringan per dasarian.</p>
            </div>
            {isPending && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin"/> Menyimpan...
                </div>
            )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-2">Label Periode Aktif</label>
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        value={periodeLabel}
                        onChange={(e) => setPeriodeLabel(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 outline-none"
                    />
                </div>
                <button 
                    onClick={handleSaveLabel} 
                    disabled={isPending}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    <Save className="w-4 h-4" /> Simpan Label
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab("HUJAN")} 
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "HUJAN" ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                >
                    <CloudRain className="w-5 h-5" /> Peringatan Curah Hujan Tinggi
                </button>
                <button 
                    onClick={() => setActiveTab("KEKERINGAN")} 
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "KEKERINGAN" ? "bg-orange-50 text-orange-700 border-b-2 border-orange-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                >
                    <Sun className="w-5 h-5" /> Peringatan Kekeringan
                </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Wilayah (Kabupaten/Kota)</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">{regions.length}</span>
                </div>
                <button 
                    onClick={handleResetAll} 
                    className="text-xs flex items-center gap-1.5 text-slate-600 hover:text-red-600 font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all shadow-sm"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset ke Aman
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                {regions.map((item) => {
                    const currentLevel = activeTab === "HUJAN" ? item.rainLevel : item.droughtLevel;
                    const isUpdating = updatingItems[item.id];

                    return (
                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isUpdating ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                            <div className="flex items-center gap-3">
                                {isUpdating ? (
                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${activeTab === "HUJAN" ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                )}
                                <span className={`font-semibold text-sm ${isUpdating ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {item.name}
                                </span>
                            </div>

                            <div className="relative group">
                                <select
                                    value={currentLevel}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value as WarningLevel)}
                                    disabled={isUpdating}
                                    className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-xs font-bold uppercase cursor-pointer border shadow-sm outline-none transition-all disabled:opacity-50 ${getStatusColor(currentLevel)}`}
                                >
                                    <option value="AMAN">🟢 Aman</option>
                                    <option value="WASPADA">🟡 Waspada</option>
                                    <option value="SIAGA">🟠 Siaga</option>
                                    <option value="AWAS">🔴 Awas</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                <FileText className={`w-6 h-6 ${activeTab === 'HUJAN' ? 'text-blue-500' : 'text-orange-500'}`} /> 
                Upload Dokumen Peringatan ({activeTab === 'HUJAN' ? 'Hujan' : 'Kekeringan'})
            </h3>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="Judul Dokumen (Misal: Analisis Dasarian II...)" 
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="flex-[2] px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex-1 relative">
                        <input 
                            id="pdie-upload"
                            type="file" 
                            accept=".pdf,image/*" 
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-l-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer border border-slate-300 rounded-lg bg-white" 
                        />
                    </div>
                    <button 
                        onClick={handleUpload} 
                        disabled={isUploadingFile || !uploadFile || !uploadTitle} 
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                        {isUploadingFile ? <><Loader2 className="animate-spin w-4 h-4"/> Mengupload...</> : <><Plus className="w-4 h-4" /> Upload</>}
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Gambar akan otomatis dikompres ke WebP. Dokumen ini akan muncul di tab {activeTab} halaman publik.</p>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dokumen Terupload ({documents.filter(d => d.type === activeTab).length})</h4>
                
                {documents.filter(d => d.type === activeTab).length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                        Belum ada dokumen untuk kategori ini.
                    </div>
                )}

                {documents.filter(d => d.type === activeTab).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-slate-50 border ${doc.type === 'HUJAN' ? 'border-blue-100 text-blue-600' : 'border-orange-100 text-orange-600'}`}>
                                {doc.filePath.endsWith('.webp') || doc.filePath.endsWith('.jpg') || doc.filePath.endsWith('.png') 
                                    ? <ImageIcon className="w-6 h-6"/> 
                                    : <FileText className="w-6 h-6"/>
                                }
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{doc.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{doc.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat">
                                <FileText className="w-4 h-4" />
                            </a>
                            
                            {/* --- TOMBOL HAPUS GLOBAL --- */}
                            <GlobalDeleteButton 
                                id={doc.id} 
                                model="pdieDocument" 
                                fileUrl={doc.fileUrl} 
                                bucketName="bmkg-public" 
                                revalidateUrl="/admin/peringatan-dini"
                                onSuccess={() => {
                                    // Filter data lokal secara instan agar tabel langsung update
                                    setDocuments(prev => prev.filter(d => d.id !== doc.id));
                                }}
                            />
                            {/* ------------------------- */}
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}