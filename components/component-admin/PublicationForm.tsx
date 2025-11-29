"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createPublication, updatePublication } from "@/app/admin/actions";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";

interface PublicationFormProps {
  initialData?: {
    id: string;
    type: string;
    title: string;
    author: string;
    year: string;
    edition: string | null;
    abstract: string | null;
    tags: string[];
    coverUrl: string | null;
    pdfUrl: string;
  };
}

export default function PublicationForm({ initialData }: PublicationFormProps) {
  const isEditMode = !!initialData;
  
  // State
  const [type, setType] = useState(initialData?.type || "Buletin");
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  const [uploading, setUploading] = useState(false);

  // Helper Upload (Bisa dipakai untuk Gambar maupun PDF)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPdf: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];

    // --- 1. VALIDASI UKURAN FILE ---
    const maxSizeMB = isPdf ? 10 : 2; // PDF 10MB, Gambar 2MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      alert(`File terlalu besar! \nUkuran file: ${(file.size / 1024 / 1024).toFixed(2)} MB.\nBatas maksimal: ${maxSizeMB} MB.`);
      e.target.value = ""; // Reset input
      return;
    }

    // --- 2. PROSES UPLOAD ---
    setUploading(true);
    // Prefix nama file biar rapi (img-xxx atau doc-xxx)
    const fileName = `${isPdf ? "doc" : "img"}-${Date.now()}-${file.name}`;
    
    const { error } = await supabase.storage.from("bmkg-public").upload(fileName, file);
    
    if (error) {
      alert("Upload gagal: " + error.message);
    } else {
      // Ambil URL Publik
      const { data } = supabase.storage.from("bmkg-public").getPublicUrl(fileName);
      if (isPdf) setPdfUrl(data.publicUrl);
      else setCoverUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (isEditMode && initialData) {
      await updatePublication(initialData.id, formData);
    } else {
      await createPublication(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200">
      <h1 className="text-xl font-bold mb-6">
        {isEditMode ? "Edit Publikasi" : "Tambah Publikasi Baru"}
      </h1>
      
      <form action={handleSubmit} className="space-y-6">
        
        {/* 1. Tipe Publikasi */}
        <div>
          <label className="block text-sm font-medium mb-1">Jenis Dokumen</label>
          <select 
            name="type" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
             <option value="Buletin">Buletin (Bulanan)</option>
             <option value="Artikel">Artikel (Populer)</option>
             <option value="Makalah">Makalah (Teknis/Jurnal)</option>
          </select>
        </div>

        {/* 2. Upload Area */}
        {/* LOGIKA GRID: Jika Buletin (2 Kolom), Jika Lainnya (1 Kolom) */}
        <div className={`grid grid-cols-1 ${type === 'Buletin' ? 'md:grid-cols-2' : ''} gap-6`}>
            
            {/* --- UPLOAD COVER (HANYA MUNCUL JIKA BULETIN) --- */}
            {type === "Buletin" && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <label className="block text-sm font-medium mb-2">Cover Buletin</label>
                    
                    {coverUrl ? (
                        <div className="relative mb-2">
                            <img src={coverUrl} alt="Preview" className="h-32 mx-auto object-cover rounded shadow" />
                            <input type="hidden" name="coverUrl" value={coverUrl} />
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center bg-gray-50 rounded mb-2 text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    )}
                    
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition">
                        Pilih Gambar
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, false)} />
                    </label>

                    <p className="text-[10px] text-gray-400 mt-2">
                        Maks. <span className="font-semibold">1 MB</span> (JPG/PNG)
                    </p>
                </div>
            )}

            {/* --- UPLOAD PDF (SELALU MUNCUL) --- */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex flex-col justify-center">
                <label className="block text-sm font-medium mb-2">File Dokumen (PDF) <span className="text-red-500">*</span></label>
                
                {pdfUrl ? (
                    <div className="relative mb-2 h-32 flex flex-col items-center justify-center bg-blue-50 rounded text-blue-600 border border-blue-200">
                        <FileText className="w-10 h-10 mb-1" />
                        <span className="text-xs px-2 truncate w-full max-w-[200px]">File Terupload</span>
                        <input type="hidden" name="pdfUrl" value={pdfUrl} />
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center bg-gray-50 rounded mb-2 text-gray-400">
                        <Upload className="w-8 h-8" />
                    </div>
                )}
                
                <div>
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition">
                        Upload PDF
                        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUpload(e, true)} />
                    </label>
                </div>

                <p className="text-[10px] text-gray-400 mt-2">
                    Maks. <span className="font-semibold">5 MB</span> (PDF)
                </p>
            </div>
        </div>
        
        {uploading && <p className="text-center text-xs text-blue-500 animate-pulse">Sedang mengupload file...</p>}


        {/* 3. Data Umum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Judul Dokumen</label>
                <input type="text" name="title" defaultValue={initialData?.title} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Judul lengkap..." />
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-1">Penulis / Divisi</label>
                <input type="text" name="author" defaultValue={initialData?.author} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Stasiun Klimatologi" />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Tahun Terbit</label>
                <input type="number" name="year" defaultValue={initialData?.year || new Date().getFullYear()} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
        </div>

        {/* 4. Input Khusus (Conditional) */}
        {type === "Buletin" && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <label className="block text-sm font-medium mb-1 text-yellow-800">Edisi Buletin</label>
                <input type="text" name="edition" defaultValue={initialData?.edition || ""} className="w-full p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="Contoh: November 2024" />
            </div>
        )}

        {(type === "Artikel" || type === "Makalah") && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-blue-800">Abstrak / Ringkasan</label>
                    <textarea name="abstract" defaultValue={initialData?.abstract || ""} rows={3} className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ringkasan singkat isi dokumen..." />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-blue-800">Tags / Topik (Pisahkan koma)</label>
                    <input type="text" name="tags" defaultValue={initialData?.tags.join(", ")} className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Iklim, Hujan, Radar" />
                </div>
            </div>
        )}

        {/* Submit Button */}
        <button 
            type="submit" 
            disabled={uploading || !pdfUrl} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {isEditMode ? "Simpan Perubahan" : "Upload Publikasi"}
        </button>

      </form>
    </div>
  );
}