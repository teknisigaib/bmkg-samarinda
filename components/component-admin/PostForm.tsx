"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { createPost, updatePost } from "@/app/(admin)/admin/actions";
import RichTextEditor from "./RichTextEditor";
import { Image as ImageIcon, X, Save, Calendar, Loader2 } from "lucide-react";

// --- IMPORT LIBRARY KOMPRESI ---
import imageCompression from 'browser-image-compression'; 

export interface PostData {
  id: string;
  title: string;
  author: string | null;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date | string;
}

interface PostFormProps {
  initialData?: PostData | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const formatDateForInput = (dateString?: Date | string) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  return (new Date(date.getTime() - offset)).toISOString().split('T')[0];
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

export default function PostForm({ initialData, onCancel, onSuccess }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [date, setDate] = useState(formatDateForInput(initialData?.createdAt));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!initialData;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // --- HANDLE UPLOAD DENGAN KOMPRESI ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const originalFile = e.target.files[0];
    
    // Validasi Awal (Misal tolak jika > 10MB biar browser gak hang)
    if (originalFile.size > 10 * 1024 * 1024) { 
      alert("File asli terlalu besar (>10MB). Silakan pilih file lain."); 
      return; 
    }

    setUploading(true);

    try {
      // 1. KONFIGURASI KOMPRESI
      const options = {
        maxSizeMB: 0.5,          // Target ukuran file maksimal 500KB (0.5MB)
        maxWidthOrHeight: 1280,  // Resize lebar maksimal jadi 1280px (Cukup buat Web)
        useWebWorker: true,      // Biar browser gak nge-lag saat kompres
        fileType: "image/webp"   // Paksa ubah jadi WebP (Lebih kecil dari JPG/PNG)
      };

      // 2. PROSES KOMPRESI
      // console.log(`Original: ${(originalFile.size / 1024 / 1024).toFixed(2)} MB`);
      const compressedFile = await imageCompression(originalFile, options);
      // console.log(`Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      // 3. BUAT NAMA FILE RAPI
      const cleanTitle = title ? sanitizeFileName(title) : "untitled";
      const datePrefix = new Date().toISOString().split('T')[0];
      const timestamp = Date.now().toString().slice(-4);
      
      // Extensi selalu .webp karena kita sudah convert
      const newFileName = `berita/${datePrefix}-${cleanTitle}-${timestamp}.webp`;

      // 4. UPLOAD KE SUPABASE
      const { error } = await supabase.storage.from("bmkg-public").upload(newFileName, compressedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/webp' // Pastikan mime-type benar
      });

      if (error) throw error;

      const { data } = supabase.storage.from("bmkg-public").getPublicUrl(newFileName);
      setImageUrl(data.publicUrl);

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Gagal mengupload/kompresi gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!content) { alert("Isi berita tidak boleh kosong"); return; }
    setIsSubmitting(true);
    formData.set("content", content);
    formData.set("imageUrl", imageUrl);

    try {
        if (isEditMode && initialData) { 
          await updatePost(initialData.id, formData); 
        } else { 
          await createPost(formData); 
        }
        onSuccess();
    } catch (error) { 
      console.error(error); 
      alert("Gagal menyimpan data."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {isEditMode ? "Edit Berita" : "Buat Berita Baru"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {title ? `Draft: ${title}` : "Isi detail informasi di bawah ini."}
                </p>
            </div>
            <button 
                onClick={onCancel} 
                className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-full transition border border-slate-200"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content Form */}
        <div className="p-6 sm:p-8 space-y-8">
             <form id="post-form" action={handleSubmit} className="space-y-6">
                
                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Kolom Kiri: Gambar */}
                    <div className="lg:col-span-1 space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Cover Gambar</label>
                        
                        <div className={`border-2 border-dashed rounded-xl p-4 text-center transition group relative bg-slate-50/50 overflow-hidden
                            ${uploading ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:bg-slate-50 cursor-pointer'}`}
                        >
                            {uploading ? (
                                <div className="h-48 flex flex-col items-center justify-center text-blue-600">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <span className="text-xs font-bold">Mengompres & Upload...</span>
                                </div>
                            ) : imageUrl ? (
                                <>
                                    <img src={imageUrl} alt="Preview" className="h-48 w-full object-cover rounded-lg shadow-sm" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-300">
                                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Ganti Gambar</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-48 w-full flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Klik untuk upload</span>
                                    <span className="text-[10px] mt-1 text-emerald-600 font-medium">Auto-Compress (Max 500KB)</span>
                                </div>
                            )}
                            
                            {/* Input File */}
                            <input 
                              type="file" 
                              onChange={handleUpload} 
                              accept="image/*" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                              disabled={uploading} 
                            />
                            <input type="hidden" name="imageUrl" value={imageUrl} />
                        </div>
                    </div>

                    {/* Kolom Kanan: Input Teks */}
                    <div className="lg:col-span-2 space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul Berita</label>
                            <input 
                              type="text" 
                              name="title" 
                              required 
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" 
                              placeholder="Masukkan judul berita..." 
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Kategori</label>
                                <select name="category" defaultValue={initialData?.category || "Berita"} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                                    <option value="Berita">Berita</option>
                                    <option value="Kegiatan">Kegiatan</option>
                                    <option value="Edukasi">Edukasi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Penulis</label>
                                <input type="text" name="author" required defaultValue={initialData?.author || "Admin"} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal Rilis</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    name="date" 
                                    required 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-11 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Ringkasan (Excerpt)</label>
                            <textarea name="excerpt" required rows={2} defaultValue={initialData?.excerpt} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition leading-relaxed" placeholder="Ringkasan singkat..." />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Isi Berita Lengkap</label>
                    <div className="rounded-xl border border-slate-300 overflow-hidden ring-1 ring-slate-100">
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>
                    <input type="hidden" name="content" value={content} />
                </div>
             </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
            <button 
                type="button" 
                onClick={onCancel}
                className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl font-bold transition shadow-sm"
                disabled={isSubmitting}
            >
                Batal
            </button>
            
            <button 
                onClick={() => (document.getElementById('post-form') as HTMLFormElement)?.requestSubmit()}
                disabled={uploading || isSubmitting} 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isSubmitting && <Save className="w-4 h-4" />}
                {isSubmitting ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Terbitkan")}
            </button>
        </div>

      </div>
    </div>
  );
}