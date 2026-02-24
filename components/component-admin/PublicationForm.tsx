"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { createPublication, updatePublication } from "@/app/(admin)/admin/actions";
import { UploadCloud, FileText, Image as ImageIcon, X, Save, Loader2 } from "lucide-react";
import imageCompression from 'browser-image-compression'; 

interface PublicationFormProps {
  initialData?: any;
  activeTab: "Buletin" | "ArtikelMakalah"; 
  onClose: () => void;
  onSuccess: () => void;
}

const sanitizeFileName = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
};

export default function PublicationForm({ initialData, activeTab, onClose, onSuccess }: PublicationFormProps) {
  const isEditMode = !!initialData;
  
  const defaultType = activeTab === "Buletin" ? "Buletin" : "Artikel";
  const [type, setType] = useState(initialData?.type || defaultType);
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const [coverPreview, setCoverPreview] = useState(initialData?.coverUrl || "");
  const [pdfName, setPdfName] = useState(initialData?.pdfUrl ? "File PDF sudah tersimpan" : "");
  
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

    if (activeTab === "Buletin") {
        formData.set("type", "Buletin");
    }

    try {
      let finalCoverUrl = initialData?.coverUrl || "";
      let finalPdfUrl = initialData?.pdfUrl || "";

      // Upload Cover (Hanya dieksekusi jika ada file cover yang dipilih)
      if (coverFile) {
        const compressedCover = await imageCompression(coverFile, {
            maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/webp"
        });
        const coverName = `covers/${cleanTitle}-${timestamp}.webp`;
        const { error } = await supabase.storage.from("bmkg-public").upload(coverName, compressedCover);
        if (error) throw error;
        finalCoverUrl = supabase.storage.from("bmkg-public").getPublicUrl(coverName).data.publicUrl;
      }

      if (pdfFile) {
        const pdfFileName = `dokumen/${cleanTitle}-${timestamp}.pdf`;
        const { error } = await supabase.storage.from("bmkg-public").upload(pdfFileName, pdfFile, {
            contentType: 'application/pdf'
        });
        if (error) throw error;
        finalPdfUrl = supabase.storage.from("bmkg-public").getPublicUrl(pdfFileName).data.publicUrl;
      }

      if (!finalPdfUrl) throw new Error("File PDF wajib diupload!");

      formData.set("coverUrl", finalCoverUrl);
      formData.set("pdfUrl", finalPdfUrl);

      if (isEditMode) {
        await updatePublication(initialData.id, formData);
      } else {
        await createPublication(formData);
      }

      onSuccess(); 

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
        
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? "Edit Dokumen" : `Tambah ${activeTab === 'Buletin' ? 'Buletin' : 'Artikel/Makalah'}`}
            </h2>
            <p className="text-xs text-slate-500">Lengkapi data dokumen di bawah ini.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* KOLOM KIRI: File Uploads */}
              <div className="space-y-6">
                  
                  {activeTab === "ArtikelMakalah" && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Jenis Dokumen</label>
                        <select 
                            name="type" value={type} onChange={(e) => setType(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-slate-700"
                        >
                            <option value="Artikel">Artikel</option>
                            <option value="Makalah">Makalah Ilmiah</option>
                        </select>
                      </div>
                  )}

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

                  {/* --- PERUBAHAN DI SINI: Cover HANYA untuk Buletin --- */}
                  {activeTab === "Buletin" && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Cover Depan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl h-40 hover:bg-slate-50 transition flex flex-col items-center justify-center text-slate-400 overflow-hidden group">
                            <input 
                                type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                required={!isEditMode} // Wajib jika baru nambah buletin
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
                                    <span className="text-xs font-medium">Upload Cover Gambar</span>
                                </>
                            )}
                        </div>
                      </div>
                  )}
              </div>

              {/* KOLOM KANAN: Text Inputs */}
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul Dokumen <span className="text-red-500">*</span></label>
                      <input type="text" name="title" defaultValue={initialData?.title} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder={`Masukkan judul ${activeTab === 'Buletin' ? 'Buletin' : 'Artikel'}...`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Tahun Terbit <span className="text-red-500">*</span></label>
                          <input type="number" name="year" defaultValue={initialData?.year || new Date().getFullYear()} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Penulis / Divisi <span className="text-red-500">*</span></label>
                          <input type="text" name="author" defaultValue={initialData?.author || "BMKG Samarinda"} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                  </div>

                  {activeTab === "Buletin" && (
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Edisi (Bulan) <span className="text-red-500">*</span></label>
                          <input type="text" name="edition" defaultValue={initialData?.edition} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Januari 2026" />
                      </div>
                  )}

                  {activeTab === "ArtikelMakalah" && (
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