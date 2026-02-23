"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, X, Save, UploadCloud, Loader2 } from "lucide-react"; // Trash2 dihapus
import Image from "next/image";
import { getPegawai, savePegawai, Pegawai } from "@/lib/data-pegawai"; // deletePegawai dihapus
import { supabase } from "@/lib/supabase"; 
import GlobalDeleteButton from "@/components/component-admin/GlobalDeleteButton"; // IMPORT TOMBOL GLOBAL

// --- IMPORT LIBRARY KOMPRESI ---
import imageCompression from 'browser-image-compression';

// --- HELPER: SANITIZE FILENAME ---
const sanitizeFileName = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') 
    .replace(/-+/g, '-')        
    .replace(/^-|-$/g, '')      
    .slice(0, 50);              
};

export default function AdminPegawaiPage() {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Pegawai>({
    id: "", name: "", position: "", group: "Fungsional", image: ""
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getPegawai();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePegawai(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleEdit = (pegawai: Pegawai) => {
    setFormData(pegawai);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ id: "", name: "", position: "", group: "Fungsional", image: "" });
    setIsModalOpen(true);
  };

  // --- FUNGSI UPLOAD GAMBAR BARU (UPGRADED) ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        alert("File terlalu besar. Maksimal 10MB sebelum kompresi.");
        return;
      }

      setUploading(true);

      const options = {
        maxSizeMB: 0.5,           
        maxWidthOrHeight: 800,    
        useWebWorker: true,
        fileType: "image/webp"    
      };

      const compressedFile = await imageCompression(file, options);

      const cleanName = formData.name ? sanitizeFileName(formData.name) : "pegawai-baru";
      const cleanJob = formData.position ? sanitizeFileName(formData.position) : "staff";
      const timestamp = Date.now().toString().slice(-4);
      
      const filePath = `pegawai/${cleanName}-${cleanJob}-${timestamp}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('bmkg-public')
        .upload(filePath, compressedFile, {
             cacheControl: '3600',
             upsert: false,
             contentType: 'image/webp'
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('bmkg-public')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));

    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Gagal mengupload gambar. Cek koneksi internet Anda.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pegawai</h1>
          <p className="text-gray-500 text-sm">Kelola daftar pimpinan dan staff stasiun.</p>
        </div>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" /> Tambah Pegawai
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Pegawai</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Jabatan</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Kelompok</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400 italic">Memuat data pegawai...</td></tr>
            ) : data.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada data pegawai.</td></tr>
            ) : data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs bg-slate-100">NA</div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{item.position}</div> 
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 hidden sm:table-cell">{item.position}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.group === 'Pimpinan' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                    item.group === 'Struktural' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {item.group}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                    
                    {/* --- TOMBOL HAPUS GLOBAL --- */}
                    <GlobalDeleteButton 
                      id={item.id} 
                      model="pegawai" 
                      fileUrl={item.image} // Kolom foto di database bernama "image"
                      bucketName="bmkg-public" 
                      revalidateUrl="/admin/pegawai"
                      onSuccess={loadData} // <-- Untuk merefresh tabel setelah dihapus
                    />
                    {/* ------------------------- */}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM (TIDAK ADA PERUBAHAN, TETAP SAMA) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div>
                  <h3 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h3>
                  <p className="text-xs text-gray-500">Lengkapi profil pegawai di bawah ini.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 shrink-0 group">
                      {formData.image ? (
                          <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <UploadCloud className="w-6 h-6 mb-1 opacity-50" />
                              <span className="text-[9px] font-bold text-center leading-tight">Upload<br/>Foto</span>
                          </div>
                      )}
                      
                      {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20">
                              <Loader2 className="w-6 h-6 animate-spin mb-1" />
                              <span className="text-[8px] font-bold">Compressing...</span>
                          </div>
                      )}
                  </div>

                  <div className="space-y-2 pt-1">
                      <label className="block text-sm font-bold text-gray-700">Foto Profil</label>
                      <div className="flex flex-col gap-2">
                          <input 
                              type="file" 
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleUpload}
                              className="hidden" 
                          />
                          <button 
                              type="button"
                              disabled={uploading}
                              onClick={() => fileInputRef.current?.click()}
                              className="w-fit text-sm font-bold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                          >
                              {uploading ? "Memproses..." : (formData.image ? "Ganti Foto" : "Pilih File Foto...")}
                          </button>
                          <p className="text-xs text-gray-500 leading-tight">
                              Format JPG/PNG akan otomatis dikompres & diubah ke WebP. Max ukuran file asli 10MB.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap & Gelar</label>
                    <input 
                        required 
                        type="text" 
                        placeholder="Contoh: Dr. Andi Susanto, M.Si"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-gray-800 placeholder:font-normal placeholder:text-gray-400" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Kelompok</label>
                        <select 
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition cursor-pointer"
                            value={formData.group} 
                            onChange={e => setFormData({...formData, group: e.target.value as any})}
                        >
                            <option value="Pimpinan">Pimpinan</option>
                            <option value="Struktural">Struktural</option>
                            <option value="Fungsional">Fungsional</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Jabatan</label>
                        <input 
                            required 
                            type="text" 
                            placeholder="Contoh: Kepala Stasiun"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            value={formData.position} 
                            onChange={e => setFormData({...formData, position: e.target.value})} 
                        />
                    </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    disabled={uploading} 
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" /> Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}