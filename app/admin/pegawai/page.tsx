"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, X, Save, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { getPegawai, savePegawai, deletePegawai, Pegawai } from "@/lib/data-pegawai";
import { supabase } from "@/lib/supabase"; // Import helper supabase tadi

export default function AdminPegawaiPage() {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk Loading Upload
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

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus pegawai ini?")) {
      await deletePegawai(id);
      loadData();
    }
  };

  const handleEdit = (pegawai: Pegawai) => {
    setFormData(pegawai);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ id: "", name: "", position: "", group: "Fungsional", image: "" });
    setIsModalOpen(true);
  };

  // --- FUNGSI UPLOAD GAMBAR BARU ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // 1. Buat nama file unik (timestamp-namafile)
      // Bersihkan nama file dari spasi/karakter aneh
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `pegawai/${fileName}`; // Masuk folder photos

      // 2. Upload ke Supabase Storage (Bucket: 'pegawai')
      const { error: uploadError } = await supabase.storage
        .from('bmkg-public') // Pastikan nama bucket di dashboard sama dengan ini
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Ambil Public URL
      const { data: publicUrlData } = supabase.storage
        .from('bmkg-public')
        .getPublicUrl(filePath);

      // 4. Set URL ke Form Data
      setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));

    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Gagal mengupload gambar. Cek koneksi atau konfigurasi bucket.");
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
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus className="w-4 h-4" /> Tambah Pegawai
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Pegawai</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Jabatan</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Kelompok</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">Memuat data...</td></tr>
            ) : data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">NA</div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{item.position}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.group === 'Pimpinan' ? 'bg-purple-100 text-purple-700' :
                    item.group === 'Struktural' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.group}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* --- INPUT FILE GAMBAR --- */}
              <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Foto Profil</label>
                  
                  <div className="flex items-center gap-4">
                    {/* Preview Image */}
                    <div className="relative w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                        {formData.image ? (
                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Tombol Upload */}
                    <div className="flex-1">
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
                            className="text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {uploading ? "Sedang Mengupload..." : "Pilih Foto..."}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG. Maks 2MB.</p>
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap & Gelar</label>
                    <input required type="text" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kelompok</label>
                    <select className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.group} onChange={e => setFormData({...formData, group: e.target.value as any})}>
                      <option value="Pimpinan">Pimpinan</option>
                      <option value="Struktural">Struktural</option>
                      <option value="Fungsional">Fungsional</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jabatan</label>
                    <input required type="text" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Batal</button>
                <button type="submit" disabled={uploading} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:bg-blue-400">
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}