"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { createPublication, updatePublication } from "@/app/(admin)/admin/actions";
import { UploadCloud, FileText, Image as ImageIcon, X, Save, Loader2 } from "lucide-react";
import imageCompression from 'browser-image-compression'; 

interface PublicationFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

// Helper Rename File
const sanitizeFileName = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
};

export default function PublicationForm({ initialData, onClose, onSuccess }: PublicationFormProps) {
  const isEditMode = !!initialData;
  const [type, setType] = useState(initialData?.type || "Buletin");
  
  // State File (Belum diupload, baru dipilih user)
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  // State Preview URL (Untuk edit mode / preview lokal)
  const [coverPreview, setCoverPreview] = useState(initialData?.coverUrl || "");
  const [pdfName, setPdfName] = useState(initialData?.pdfUrl ? "File PDF sudah tersimpan" : "");
  
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Kunci scroll background saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const cleanTitle = title ? sanitizeFileName(title) : "publikasi";
    const timestamp = Date.now().toString().slice(-4);

    try {
      let finalCoverUrl = initialData?.coverUrl || "";
      let finalPdfUrl = initialData?.pdfUrl || "";

      // 1. UPLOAD COVER (Jika ada file baru)
      if (coverFile) {
        const compressedCover = await imageCompression(coverFile, {
            maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/webp"
        });
        const coverName = `covers/${cleanTitle}-${timestamp}.webp`;
        const { error } = await supabase.storage.from("bmkg-public").upload(coverName, compressedCover);
        if (error) throw error;
        finalCoverUrl = supabase.storage.from("bmkg-public").getPublicUrl(coverName).data.publicUrl;
      }

      // 2. UPLOAD PDF (Jika ada file baru)
      if (pdfFile) {
        const pdfFileName = `dokumen/${cleanTitle}-${timestamp}.pdf`;
        const { error } = await supabase.storage.from("bmkg-public").upload(pdfFileName, pdfFile, {
            contentType: 'application/pdf'
        });
        if (error) throw error;
        finalPdfUrl = supabase.storage.from("bmkg-public").getPublicUrl(pdfFileName).data.publicUrl;
      }

      // Validasi Wajib PDF
      if (!finalPdfUrl) throw new Error("File PDF wajib diupload!");

      // 3. UPDATE FORMDATA & SIMPAN KE DB
      formData.set("coverUrl", finalCoverUrl);
      formData.set("pdfUrl", finalPdfUrl);

      if (isEditMode) {
        await updatePublication(initialData.id, formData);
      } else {
        await createPublication(formData);
      }

      onSuccess(); // Tutup modal & refresh

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal menyimpan publikasi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        
        {/* Header Modal */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? "Edit Publikasi" : "Tambah Publikasi Baru"}
            </h2>
            <p className="text-xs text-slate-500">Lengkapi data dokumen di bawah ini.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* KOLOM KIRI: File Uploads */}
              <div className="space-y-6">
                  {/* Tipe Publikasi */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Jenis Dokumen</label>
                    <select 
                        name="type" value={type} onChange={(e) => setType(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="Buletin">Buletin</option>
                        <option value="Artikel">Artikel</option>
                        <option value="Makalah">Makalah</option>
                    </select>
                  </div>

                  {/* Upload PDF Wajib */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">File Dokumen (PDF) <span className="text-red-500">*</span></label>
                    <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 hover:bg-slate-50 transition flex items-center gap-3 cursor-pointer group">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-700 truncate">
                                {pdfName || "Pilih File PDF..."}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Maks. 2MB. Format penamaan otomatis.</p>
                        </div>
                        <input 
                            type="file" accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if(file) {
                                    if(file.size > 2*1024*1024) return alert("Maks 2MB!");
                                    setPdfFile(file);
                                    setPdfName(file.name);
                                }
                            }}
                        />
                    </div>
                  </div>

                  {/* Upload Cover (Khusus Buletin/Artikel) */}
                  {(type === "Buletin" || type === "Artikel") && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Cover Depan (Opsional)</label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl h-40 hover:bg-slate-50 transition flex flex-col items-center justify-center text-slate-400 overflow-hidden group">
                            <input 
                                type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        setCoverFile(file);
                                        setCoverPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Ganti Cover</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Upload Cover</span>
                                </>
                            )}
                        </div>
                      </div>
                  )}
              </div>

              {/* KOLOM KANAN: Text Inputs */}
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul Dokumen</label>
                      <input type="text" name="title" defaultValue={initialData?.title} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan judul..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Tahun Terbit</label>
                          <input type="number" name="year" defaultValue={initialData?.year || new Date().getFullYear()} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Penulis / Divisi</label>
                          <input type="text" name="author" defaultValue={initialData?.author || "BMKG Samarinda"} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                  </div>

                  {type === "Buletin" && (
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Edisi (Bulan)</label>
                          <input type="text" name="edition" defaultValue={initialData?.edition} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Januari 2024" />
                      </div>
                  )}

                  {(type === "Artikel" || type === "Makalah") && (
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Abstrak / Ringkasan</label>
                              <textarea name="abstract" defaultValue={initialData?.abstract} rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ringkasan isi dokumen..." />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Tags (Pisahkan koma)</label>
                              <input type="text" name="tags" defaultValue={initialData?.tags?.join(", ")} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Iklim, Cuaca, Hujan" />
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* Footer Form */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
              <button type="button" onClick={onClose} disabled={uploading} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition">
                  Batal
              </button>
              <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md">
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {uploading ? "Menyimpan & Upload..." : (isEditMode ? "Simpan Perubahan" : "Terbitkan Publikasi")}
              </button>
          </div>

        </form>
      </div>
    </div>
  );
}