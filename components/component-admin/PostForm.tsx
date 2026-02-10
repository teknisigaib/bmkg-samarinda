"use client";

import { useState, useEffect } from "react"; // Tambah useEffect
import { supabase } from "@/lib/supabase";
import { createPost, updatePost } from "@/app/(admin)/admin/actions";
import RichTextEditor from "./RichTextEditor";
import { Image as ImageIcon, X, Save, Calendar } from "lucide-react";

// ... (Interface PostData & Helper formatDateForInput TETAP SAMA seperti sebelumnya) ...
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

export default function PostForm({ initialData, onCancel, onSuccess }: PostFormProps) {
  // ... (State: imageUrl, uploading, content, date, isSubmitting TETAP SAMA) ...
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [date, setDate] = useState(formatDateForInput(initialData?.createdAt));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  // Disable scroll pada body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // ... (Fungsi handleUpload & handleSubmit TETAP SAMA) ...
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) { alert("Maks 2MB"); return; }
    setUploading(true);
    const fileName = `berita-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const { error } = await supabase.storage.from("bmkg-public").upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from("bmkg-public").getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
        if (isEditMode && initialData) { await updatePost(initialData.id, formData); } 
        else { await createPost(formData); }
        onSuccess();
    } catch (error) { console.error(error); alert("Gagal menyimpan."); } 
    finally { setIsSubmitting(false); }
  };

  return (
    // --- 1. OVERLAY (Backdrop Gelap) ---
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* --- 2. CARD MODAL --- */}
      <div className="bg-white w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header (Sticky) */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {isEditMode ? "Edit Berita" : "Buat Berita Baru"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Isi detail informasi di bawah ini.</p>
            </div>
            <button 
                onClick={onCancel} 
                className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-full transition border border-slate-200"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Content Form (Scrollable) */}
        <div className="p-6 sm:p-8 space-y-8">
             <form id="post-form" action={handleSubmit} className="space-y-6">
                
                {/* Grid Layout untuk Gambar & Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Kolom Kiri: Gambar */}
                    <div className="lg:col-span-1 space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Cover Gambar</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition group cursor-pointer relative bg-slate-50/50">
                            {imageUrl ? (
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
                                    <span className="text-[10px] mt-1">(Max 2MB)</span>
                                </div>
                            )}
                            <input type="file" onChange={handleUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
                            <input type="hidden" name="imageUrl" value={imageUrl} />
                        </div>
                    </div>

                    {/* Kolom Kanan: Input Teks */}
                    <div className="lg:col-span-2 space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul Berita</label>
                            <input type="text" name="title" required defaultValue={initialData?.title} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium" placeholder="Judul yang menarik..." />
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
                                <input type="text" name="author" required defaultValue={initialData?.author || ""} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Contoh: Admin" />
                            </div>
                        </div>

                         {/* Input Tanggal */}
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
                            <textarea name="excerpt" required rows={2} defaultValue={initialData?.excerpt} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition leading-relaxed" placeholder="Ringkasan singkat untuk ditampilkan di halaman depan..." />
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Isi Berita Lengkap</label>
                    <div className="rounded-xl border border-slate-300 overflow-hidden ring-1 ring-slate-100">
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>
                    <input type="hidden" name="content" value={content} />
                </div>
             </form>
        </div>

        {/* Footer (Sticky Bottom) */}
        <div className="sticky bottom-0 z-10 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
            <button 
                type="button" 
                onClick={onCancel}
                className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl font-bold transition shadow-sm"
            >
                Batal
            </button>
            
            {/* Tombol Simpan (Target Form ID) */}
            <button 
                onClick={() => (document.getElementById('post-form') as HTMLFormElement)?.requestSubmit()}
                disabled={uploading || isSubmitting} 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Terbitkan Berita")}
            </button>
        </div>

      </div>
    </div>
  );
}