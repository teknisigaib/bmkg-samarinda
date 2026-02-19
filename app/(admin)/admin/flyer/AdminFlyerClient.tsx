"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { createFlyer, deleteFlyer, toggleFlyerStatus } from "@/app/(admin)/admin/flyer/actions";
import { Loader2, Plus, Trash2, Link as LinkIcon, UploadCloud, Power } from "lucide-react";
import { useRouter } from "next/navigation";

// --- IMPORT LIBRARY KOMPRESI ---
import imageCompression from 'browser-image-compression'; 

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- HELPER: SANITIZE FILENAME ---
const sanitizeFileName = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Ganti simbol aneh dengan dash
    .replace(/-+/g, '-')        // Hapus dash beruntun
    .replace(/^-|-$/g, '')      // Hapus dash di awal/akhir
    .slice(0, 50);              // Batasi panjang
};

export default function AdminFlyerClient({ flyers }: { flyers: any[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // --- HANDLE UPLOAD & SAVE ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    // Cek file
    if (!file || file.size === 0) {
      alert("Pilih gambar terlebih dahulu!");
      setIsUploading(false);
      return;
    }

    // Validasi Ukuran Awal (>10MB tolak)
    if (file.size > 10 * 1024 * 1024) {
        alert("File terlalu besar. Maksimal 10MB.");
        setIsUploading(false);
        return;
    }

    try {
      // 1. KOMPRESI GAMBAR
      // Banner biasanya butuh resolusi agak besar, kita set max 1280px atau 1600px
      const options = {
        maxSizeMB: 0.7,           // Target max 700KB (sedikit lebih besar dari berita karena banner)
        maxWidthOrHeight: 1280,   // Resize lebar max 1280px
        useWebWorker: true,
        fileType: "image/webp"    // Convert ke WebP
      };

      // console.log("Mengompresi...");
      const compressedFile = await imageCompression(file, options);

      // 2. BUAT NAMA FILE RAPI
      // Format: flyers/YYYY-MM-DD-judul-banner-timestamp.webp
      const cleanTitle = title ? sanitizeFileName(title) : "banner-info";
      const datePrefix = new Date().toISOString().split('T')[0];
      const timestamp = Date.now().toString().slice(-4);
      
      const fileName = `flyers/${datePrefix}-${cleanTitle}-${timestamp}.webp`;
      
      // 3. UPLOAD KE SUPABASE
      const { error: uploadError } = await supabase.storage
        .from("bmkg-public") 
        .upload(fileName, compressedFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/webp'
        });

      if (uploadError) throw new Error("Gagal upload ke Storage: " + uploadError.message);

      // 4. AMBIL PUBLIC URL
      const { data: urlData } = supabase.storage
        .from("bmkg-public")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // 5. SIMPAN KE DATABASE
      // Update formData dengan URL gambar baru
      formData.set("imageUrl", publicUrl);
      
      const result = await createFlyer(formData);

      if (result.error) {
        alert(result.error);
      } else {
        // Reset Form
        formRef.current?.reset();
        setPreview(null);
        router.refresh(); 
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setIsUploading(false);
    }
  };

  // Preview Gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-8">
      
      {/* --- FORM INPUT --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" /> Tambah Banner Baru
        </h2>
        
        <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Banner</label>
              <input name="title" required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Peringatan Cuaca..." />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link Tujuan (Opsional)</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-slate-50 text-slate-500">
                  <LinkIcon className="w-4 h-4" />
                </span>
                <input name="link" type="text" className="w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Banner</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 relative hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-slate-400 overflow-hidden group">
                  <input 
                      name="file" 
                      type="file" 
                      accept="image/*" 
                      required 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isUploading}
                  />
                  {preview ? (
                      <div className="absolute inset-0 p-2 bg-white">
                        <div className="relative w-full h-full rounded overflow-hidden border border-slate-100">
                           <Image src={preview} alt="Preview" fill className="object-cover" />
                           {/* Overlay Ganti */}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                                Ganti Gambar
                           </div>
                        </div>
                      </div>
                  ) : (
                      <>
                          <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs">Klik untuk upload gambar</span>
                          <span className="text-[10px] mt-1 text-emerald-600 font-medium">Auto-Convert WebP</span>
                      </>
                  )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full h-10 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengompres & Upload...</> : "Simpan Banner"}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABEL DATA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                    <th className="px-6 py-3 w-[150px]">Preview</th>
                    <th className="px-6 py-3">Info</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {flyers.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada banner tersimpan.</td></tr>
                ) : (
                    flyers.map((flyer) => (
                        <tr key={flyer.id} className="hover:bg-slate-50 group">
                            <td className="px-6 py-4">
                                <div className="relative w-32 h-16 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                                    <Image src={flyer.image} alt={flyer.title} fill className="object-cover" sizes="150px" />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-800 text-base">{flyer.title}</div>
                                <div className="text-xs text-slate-400 truncate max-w-[200px]">
                                    {flyer.link ? <a href={flyer.link} target="_blank" className="text-blue-500 hover:underline">{flyer.link}</a> : "Tidak ada link"}
                                </div>
                                <div className="text-[10px] text-slate-300 mt-1">ID: {flyer.id.slice(0,8)}...</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={async () => {
                                      await toggleFlyerStatus(flyer.id, flyer.isActive);
                                      router.refresh();
                                    }}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                      flyer.isActive 
                                      ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    <Power className="w-3 h-3" />
                                    {flyer.isActive ? 'Aktif' : 'Non-Aktif'}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={async () => {
                                        if(confirm("Yakin hapus banner ini?")) {
                                            await deleteFlyer(flyer.id);
                                            router.refresh();
                                        }
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition" 
                                    title="Hapus"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}