"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { createClimateData, updateClimateData } from "@/app/(admin)/admin/iklim-actions";
import RichTextEditor from "./RichTextEditor";
import { Image as ImageIcon, Calendar, Wand2, X, Loader2, Save } from "lucide-react";
import imageCompression from 'browser-image-compression';

interface ClimateFormProps {
  type: string;
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const MONTHS = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" ];
const DASARIANS = ["Dasarian I", "Dasarian II", "Dasarian III", "Bulanan"];

const sanitizeFileName = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
};

export default function ClimateForm({ type, initialData, onClose, onSuccess }: ClimateFormProps) {
  const isEditMode = !!initialData;
  const now = new Date();
  
  // STATE INPUT DATA
  const [selectedDasarian, setSelectedDasarian] = useState(initialData?.dasarian || "Dasarian I");
  const [selectedMonth, setSelectedMonth] = useState(initialData ? initialData.bulan.split(" ")[0] : MONTHS[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(initialData ? parseInt(initialData.bulan.split(" ")[1]) : now.getFullYear());
  const [content, setContent] = useState(initialData?.content || "");
  
  // STATE FILE & PREVIEW (Delayed Upload)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);

  // Auto Generate Title & Period
  const [autoTitle, setAutoTitle] = useState(initialData?.title || "");
  const [autoPeriod, setAutoPeriod] = useState(initialData?.period || "");

  // Lock scroll saat modal buka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useEffect(() => {
    // Generate Periode
    let periodString = "";
    if (selectedDasarian === "Dasarian I") periodString = `01 - 10 ${selectedMonth} ${selectedYear}`;
    else if (selectedDasarian === "Dasarian II") periodString = `11 - 20 ${selectedMonth} ${selectedYear}`;
    else if (selectedDasarian === "Dasarian III") {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      const lastDay = new Date(selectedYear, monthIndex + 1, 0).getDate();
      periodString = `21 - ${lastDay} ${selectedMonth} ${selectedYear}`;
    } else {
      periodString = `01 - ${new Date(selectedYear, MONTHS.indexOf(selectedMonth) + 1, 0).getDate()} ${selectedMonth} ${selectedYear}`;
    }

    // Generate Judul
    const typeLabel = type === "HTH" ? "Hari Tanpa Hujan (HTH)" : type === "HujanDasarian" ? "Analisis Curah Hujan" : type === "PotensiBanjir" ? "Potensi Banjir" : "Informasi Iklim";
    setAutoPeriod(periodString);
    setAutoTitle(`${typeLabel} - ${selectedDasarian} ${selectedMonth} ${selectedYear}`);
  }, [selectedDasarian, selectedMonth, selectedYear, type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
        let finalImageUrl = initialData?.imageUrl || "";

        // PROSES KOMPRESI & UPLOAD JIKA ADA FILE BARU
        if (imageFile) {
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, fileType: "image/webp"
            });
            
            const cleanTitle = sanitizeFileName(autoTitle);
            const timestamp = Date.now().toString().slice(-4);
            const fileName = `iklim/${type}-${cleanTitle}-${timestamp}.webp`;

            const { error } = await supabase.storage.from("bmkg-public").upload(fileName, compressedFile, { contentType: 'image/webp' });
            if (error) throw error;
            
            finalImageUrl = supabase.storage.from("bmkg-public").getPublicUrl(fileName).data.publicUrl;
        }

        if (!finalImageUrl) throw new Error("Peta visualisasi wajib diupload!");

        // SIAPKAN FORMDATA UNTUK SERVER ACTION
        const formData = new FormData();
        formData.append("type", type);
        formData.set("title", autoTitle);
        formData.set("period", autoPeriod);
        formData.set("bulan", `${selectedMonth} ${selectedYear}`);
        formData.set("dasarian", selectedDasarian);
        formData.set("content", content);
        formData.set("imageUrl", finalImageUrl);

        if (isEditMode) await updateClimateData(initialData.id, formData);
        else await createClimateData(formData);

        onSuccess();
    } catch (error: any) {
        console.error(error);
        alert(error.message || "Terjadi kesalahan.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Calendar className="w-5 h-5 text-blue-600" />
                {isEditMode ? "Edit Data Iklim" : "Input Data Iklim Baru"}
            </h1>
            <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* AREA Selector */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Wand2 className="w-4 h-4" /> Generator Periode Otomatis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-blue-700 mb-1">Dasarian / Tipe</label>
                        <select value={selectedDasarian} onChange={(e) => setSelectedDasarian(e.target.value)} className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                            {DASARIANS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-blue-700 mb-1">Bulan</label>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-blue-700 mb-1">Tahun</label>
                        <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold mb-1 text-slate-700">Judul Lengkap</label>
                    <input type="text" value={autoTitle} readOnly className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed font-medium text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-slate-700">Periode Tanggal</label>
                    <input type="text" value={autoPeriod} readOnly className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed font-medium text-sm" />
                </div>
            </div>

            {/* UPLOAD PETA */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition group cursor-pointer relative" onClick={() => document.getElementById('map-upload')?.click()}>
                <label className="block text-sm font-bold mb-3 text-slate-700">Upload Peta Visualisasi</label>
                {imagePreview ? (
                    <div className="relative mb-2">
                        <img src={imagePreview} alt="Preview" className="h-64 mx-auto object-contain rounded-lg shadow-sm bg-white p-2 border border-slate-200" />
                    </div>
                ) : (
                    <div className="h-40 w-full flex flex-col items-center justify-center bg-white rounded-lg mb-2 border border-slate-200">
                        <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                        <span className="text-sm font-medium text-blue-600">Klik untuk pilih Peta</span>
                    </div>
                )}
                
                <input 
                    id="map-upload" type="file" accept="image/*" className="hidden" 
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                        }
                    }} 
                />
                <p className="text-[10px] text-slate-400 font-medium">Gambar akan otomatis dikompres & diubah ke format WebP.</p>
            </div>

            <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">Analisis Klimatologis</label>
                <div className="rounded-xl border border-slate-300 overflow-hidden ring-1 ring-slate-100">
                    <RichTextEditor content={content} onChange={setContent} />
                </div>
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={onClose} disabled={uploading} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition">
                    Batal
                </button>
                <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md">
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {uploading ? "Menyimpan & Upload..." : (isEditMode ? "Simpan Perubahan" : "Terbitkan Data")}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}