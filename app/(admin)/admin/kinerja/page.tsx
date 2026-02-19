"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Loader2, UploadCloud, FileText } from "lucide-react";
import { getKinerjaDocs, saveKinerjaDoc, deleteKinerjaDoc, KinerjaDoc } from "@/lib/data-kinerja";
import { supabase } from "@/lib/supabase";

// Label
const CATEGORY_LABELS: Record<string, string> = {
  Renstra: "Rencana Strategis",
  RencanaKinerja: "Rencana Kinerja Tahunan",
  PerjanjianKinerja: "Perjanjian Kinerja",
  LaporanKinerja: "Laporan Kinerja Instansi Pemerintah"
};

// --- HELPER: SANITIZE FILENAME ---
const sanitizeFileName = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') 
    .replace(/-+/g, '-')        
    .replace(/^-|-$/g, '')      
    .slice(0, 50);           
};

export default function AdminKinerjaPage() {
  const [data, setData] = useState<KinerjaDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<KinerjaDoc>({
    id: "", 
    title: "", 
    category: "LaporanKinerja", 
    year: new Date().getFullYear().toString(), 
    fileUrl: "", 
    fileSize: ""
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getKinerjaDocs();
    // @ts-ignore
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Update judul di form saat kategori/tahun berubah
  useEffect(() => {
    const label = CATEGORY_LABELS[formData.category] || formData.category;
    const autoTitle = `${label} ${formData.year}`;
    
    setFormData(prev => ({ ...prev, title: autoTitle }));
  }, [formData.category, formData.year]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileUrl) return alert("Wajib upload file PDF!");
    
    await saveKinerjaDoc(formData);
    setIsModalOpen(false);
    loadData();
  };

  // --- UPGRADED UPLOAD FUNCTION ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. Validasi Tipe File
      if (file.type !== "application/pdf") {
        alert("Hanya boleh upload file PDF!");
        return;
      }

      // 2. Validasi Ukuran Max 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }

      setUploading(true);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      
      // 3. GENERATE NAMA FILE
      const cleanCategory = sanitizeFileName(CATEGORY_LABELS[formData.category] || formData.category);
      const timestamp = Date.now().toString().slice(-4);
      const fileName = `kinerja/${formData.year}-${cleanCategory}-${timestamp}.pdf`;

      // 4. UPLOAD KE SUPABASE
      const { error } = await supabase.storage.from('bmkg-public').upload(fileName, file, {
        contentType: 'application/pdf', 
        upsert: false
      });

      if (error) throw error;

      // 5. AMBIL PUBLIC URL
      const { data: urlData } = supabase.storage.from('bmkg-public').getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, fileUrl: urlData.publicUrl, fileSize: sizeMB }));

    } catch (error) {
      console.error(error);
      alert("Gagal upload file. Cek koneksi atau nama file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus dokumen ini?")) {
      await deleteKinerjaDoc(id);
      loadData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dokumen Kinerja</h1>
          <p className="text-gray-500 text-sm">Upload LAKIP, Renstra, dan dokumen lainnya.</p>
        </div>
        <button onClick={() => { 
            setFormData({ 
                id: "", 
                title: "", 
                category: "LaporanKinerja", 
                year: new Date().getFullYear().toString(), 
                fileUrl: "", 
                fileSize: "" 
            }); 
            setIsModalOpen(true); 
        }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus className="w-4 h-4" /> Upload Dokumen
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Dokumen</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Kategori</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tahun</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr> : 
             data.map((item) => {
              
              // Jika item.title kosong, gunakan label kategori + tahun
              const label = CATEGORY_LABELS[item.category] || item.category;
              const displayTitle = item.title || `${label} ${item.year}`;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">

                      <div className="font-bold text-gray-900">{displayTitle}</div>
                      
                      <a href={item.fileUrl} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                          <FileText className="w-3 h-3" /> {item.fileSize || "PDF File"}
                      </a>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                      {label}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono">{item.year}</td>
                  <td className="p-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Upload Dokumen</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori Dokumen</label>
                        <select className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Renstra">Rencana Strategis (RENSTRA)</option>
                            <option value="RencanaKinerja">Rencana Kinerja Tahunan (RKT)</option>
                            <option value="PerjanjianKinerja">Perjanjian Kinerja (PK)</option>
                            <option value="LaporanKinerja">Laporan Kinerja (LAKIP)</option>
                        </select>
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tahun / Periode</label>
                        <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                    </div>
                </div>

                {/* Input Judul Read-Only */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Dokumen (Otomatis)</label>
                    <input 
                        readOnly 
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 font-medium cursor-not-allowed" 
                        value={formData.title} 
                    />
                </div>

                {/* Upload File */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">File PDF</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                        <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleUpload} className="hidden" />
                        
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                                <span className="text-sm text-gray-500">Mengupload...</span>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="w-10 h-10 mx-auto text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />
                                {formData.fileUrl ? (
                                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold inline-block">
                                        ✓ File Siap Disimpan
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-gray-600">Klik untuk pilih file PDF</p>
                                )}
                                {formData.fileSize && <p className="text-xs text-gray-400 mt-1">Ukuran: {formData.fileSize}</p>}
                            </>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={uploading || !formData.fileUrl} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all mt-4">
                    Simpan Dokumen
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}