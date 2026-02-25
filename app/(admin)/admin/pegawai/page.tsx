"use client";
export const dynamic = 'force-dynamic'; 

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, X, Save, UploadCloud, Loader2, Star } from "lucide-react"; 
import Image from "next/image";
import { getPegawai, savePegawai, Pegawai } from "@/lib/data-pegawai"; 
import { supabase } from "@/lib/supabase"; 
import GlobalDeleteButton from "@/components/component-admin/GlobalDeleteButton"; 
import imageCompression from 'browser-image-compression';

const sanitizeFileName = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50);              
};

export default function AdminPegawaiPage() {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Pegawai>({
    id: "", name: "", position: "", group: "Fungsional", sub_group: "Administrasi", image: "", is_ketua: false
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
    setFormData({ 
      ...pegawai, 
      sub_group: pegawai.sub_group || "Administrasi", 
      is_ketua: pegawai.is_ketua || false 
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ id: "", name: "", position: "", group: "Fungsional", sub_group: "Administrasi", image: "", is_ketua: false });
    setIsModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) return alert("Maksimal 10MB sebelum kompresi.");

      setUploading(true);
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/webp" });
      const cleanName = formData.name ? sanitizeFileName(formData.name) : "pegawai";
      const timestamp = Date.now().toString().slice(-4);
      const filePath = `pegawai/${cleanName}-${timestamp}.webp`;

      const { error: uploadError } = await supabase.storage.from('bmkg-public').upload(filePath, compressedFile, { cacheControl: '3600', upsert: false, contentType: 'image/webp' });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('bmkg-public').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
    } catch (error) {
      alert("Gagal mengupload gambar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pegawai</h1>
          <p className="text-gray-500 text-sm">Kelola daftar pimpinan, staff, dan PPNPN.</p>
        </div>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Pegawai
        </button>
      </div>

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
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-gray-400">Memuat data...</td></tr> : 
             data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                      {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">NA</div>}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                        {item.name}
                        {item.is_ketua && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded text-[10px] font-bold uppercase tracking-wider">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {item.group === "Pimpinan" ? "Kepala" : "Ketua Tim"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">{item.position}</div> 
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 hidden sm:table-cell">{item.position}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.group === 'Pimpinan' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                    item.group === 'Struktural' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    item.group === 'PPNPN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    'bg-orange-50 text-orange-700 border border-orange-100'
                  }`}>
                    {item.group} {item.group === 'Fungsional' && item.sub_group ? ` - ${item.sub_group}` : ''}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                    <GlobalDeleteButton id={item.id} model="pegawai" fileUrl={item.image} bucketName="bmkg-public" revalidateUrl="/admin/pegawai" onSuccess={loadData} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Pegawai' : 'Tambah Pegawai'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 shrink-0">
                      {formData.image ? <Image src={formData.image} alt="Preview" fill className="object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-400"><UploadCloud className="w-6 h-6 mb-1 opacity-50" /><span className="text-[9px] font-bold">Upload</span></div>}
                      {uploading && <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20"><Loader2 className="w-6 h-6 animate-spin" /></div>}
                  </div>
                  <div className="space-y-2 pt-1">
                      <label className="block text-sm font-bold text-gray-700">Foto Profil</label>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} className="hidden" />
                      <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="text-sm font-bold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm">
                          {uploading ? "Memproses..." : (formData.image ? "Ganti Foto" : "Pilih File...")}
                      </button>
                  </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap & Gelar</label>
                    <input required type="text" placeholder="Dr. Andi Susanto, M.Si" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className={formData.group !== "Fungsional" ? "col-span-2" : ""}>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Kelompok</label>
                        <select 
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.group} 
                            onChange={e => {
                              const newGroup = e.target.value as any;
                              setFormData({
                                ...formData, 
                                group: newGroup, 
                                is_ketua: (newGroup === 'Pimpinan' || newGroup === 'Fungsional') ? formData.is_ketua : false
                              });
                            }}
                        >
                            <option value="Pimpinan">Pimpinan</option>
                            <option value="Struktural">Struktural</option>
                            <option value="Fungsional">Fungsional</option>
                            <option value="PPNPN">PPNPN</option>
                        </select>
                    </div>

                    {/* HANYA MUNCUL JIKA FUNGSIONAL */}
                    {formData.group === "Fungsional" && (
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">Pilih Tim</label>
                          <select 
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              value={formData.sub_group || "Administrasi"} 
                              onChange={e => setFormData({...formData, sub_group: e.target.value})}
                          >
                              <option value="Administrasi">Administrasi</option>
                              <option value="Meteorologi">Meteorologi</option>
                              <option value="Klimatologi">Klimatologi</option>
                              <option value="Teknisi">Teknisi</option>
                          </select>
                      </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Jabatan (Tanpa 'Ketua Tim')</label>
                    <input required type="text" placeholder={formData.group === "Fungsional" ? "Contoh: PMG Muda / Penyelia" : "Contoh: Kepala Stasiun / Kasubag"} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                </div>

                {/* CHECKBOX KETUA */}
                {(formData.group === "Pimpinan" || formData.group === "Fungsional") && (
                  <div className={`mt-4 p-4 rounded-xl border ${formData.is_ketua ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        checked={formData.is_ketua || false}
                        onChange={(e) => setFormData({...formData, is_ketua: e.target.checked})}
                      />
                      <div>
                        <span className="block text-sm font-bold text-gray-800">
                          {formData.group === "Pimpinan" ? "Jadikan Kepala Stasiun" : "Jadikan Ketua Tim"}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {formData.group === "Pimpinan" ? "Centang jika ini adalah Pimpinan Tertinggi." : `Centang jika ini adalah Ketua Tim ${formData.sub_group}.`}
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200">Batal</button>
                <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"><Save className="w-4 h-4" /> Simpan Pegawai</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}