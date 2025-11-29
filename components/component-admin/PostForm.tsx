"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createPost, updatePost } from "@/app/admin/actions";
import RichTextEditor from "./RichTextEditor";
import { Image as ImageIcon } from "lucide-react"; // Import Icon Gambar

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    author: string;
    category: string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
  };
}

export default function PostForm({ initialData }: PostFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");

  const isEditMode = !!initialData;

  // Fungsi Upload dengan Validasi Ukuran & UI Konsisten
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];

    // 1. Validasi Ukuran (Maks 2 MB)
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Gambar terlalu besar! Maksimal ${maxSizeMB} MB.`);
        e.target.value = "";
        return;
    }

    // 2. Proses Upload
    setUploading(true);
    const fileName = `berita-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("bmkg-public").upload(fileName, file);
    
    if (error) {
      alert("Upload gagal: " + error.message);
    } else {
      const { data } = supabase.storage.from("bmkg-public").getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (isEditMode && initialData) {
      await updatePost(initialData.id, formData);
    } else {
      await createPost(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200">
      <h1 className="text-xl font-bold mb-6">
        {isEditMode ? "Edit Berita" : "Tulis Berita Baru"}
      </h1>
      
      <form action={handleSubmit} className="space-y-6">
        
        {/* --- UPLOAD GAMBAR (Style Baru: Kotak Dashed) --- */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <label className="block text-sm font-medium mb-3 text-gray-700">Cover Gambar Berita</label>
            
            {imageUrl ? (
                // Tampilan Preview Jika Ada Gambar
                <div className="relative mb-4 group">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="h-48 mx-auto object-cover rounded-lg shadow-sm border border-gray-100" 
                    />
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                </div>
            ) : (
                // Placeholder Jika Kosong
                <div className="h-32 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-4 border border-gray-100">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                </div>
            )}
            
            {/* Tombol Upload */}
            <div className="flex flex-col items-center gap-2">
                <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition">
                    {uploading ? "Mengupload..." : (imageUrl ? "Ganti Gambar" : "Pilih Gambar")}
                    <input 
                      type="file" 
                      onChange={handleUpload} 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploading}
                    />
                </label>
                
                <p className="text-xs text-gray-400">
                    Maks. <span className="font-semibold">1 MB</span> (Format: JPG/PNG)
                </p>
            </div>
        </div>

        {/* --- INPUT FORM LAINNYA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Judul Berita</label>
                <input 
                    type="text" name="title" required 
                    defaultValue={initialData?.title} 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Judul lengkap berita..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Penulis (Author)</label>
                <input 
                    type="text" name="author" required 
                    defaultValue={initialData?.author}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Contoh: Humas BMKG"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select 
                    name="category" 
                    defaultValue={initialData?.category}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="Berita">Berita</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Edukasi">Edukasi</option>
                </select>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ringkasan (Excerpt)</label>
          <textarea 
            name="excerpt" required rows={2} 
            defaultValue={initialData?.excerpt}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
            placeholder="Ringkasan singkat untuk tampilan depan..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Isi Berita</label>
          
          {/* WYSIWYG Editor */}
          <RichTextEditor 
            content={content} 
            onChange={(newHtml) => setContent(newHtml)} 
          />
          <input type="hidden" name="content" value={content} />
        </div>

        <button 
            type="submit" 
            disabled={uploading} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
        >
           {isEditMode ? "Simpan Perubahan" : "Terbitkan Berita"}
        </button>

      </form>
    </div>
  );
}