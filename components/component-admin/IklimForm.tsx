"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { createClimateData, updateClimateData } from "@/app/(admin)/admin/iklim-actions";
import RichTextEditor from "./RichTextEditor";
import { Image as ImageIcon, Calendar, Wand2 } from "lucide-react";

interface ClimateFormProps {
  type: string;
  redirectUrl: string;
  initialData?: {
    id: string;
    title: string;
    period: string;
    dasarian: string;
    bulan: string;
    content: string;
    imageUrl: string;
  };
}

// Data Static untuk Dropdown
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DASARIANS = ["Dasarian I", "Dasarian II", "Dasarian III", "Bulanan"];

export default function ClimateForm({ type, initialData }: ClimateFormProps) {
  const isEditMode = !!initialData;
  
  // STATE UPLOAD
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [uploading, setUploading] = useState(false);

  //  STATE TANGGAL
  const now = new Date();
  const [selectedDasarian, setSelectedDasarian] = useState(initialData?.dasarian || "Dasarian I");
  const [selectedMonth, setSelectedMonth] = useState(initialData ? initialData.bulan.split(" ")[0] : MONTHS[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(initialData ? parseInt(initialData.bulan.split(" ")[1]) : now.getFullYear());

  // State hasil kalkulasi (Otomatis)
  const [autoTitle, setAutoTitle] = useState(initialData?.title || "");
  const [autoPeriod, setAutoPeriod] = useState(initialData?.period || "");

  useEffect(() => {
    // Hitung Periode Tanggal
    let periodString = "";
    
    if (selectedDasarian === "Dasarian I") {
      periodString = `01 - 10 ${selectedMonth} ${selectedYear}`;
    } else if (selectedDasarian === "Dasarian II") {
      periodString = `11 - 20 ${selectedMonth} ${selectedYear}`;
    } else if (selectedDasarian === "Dasarian III") {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      const lastDay = new Date(selectedYear, monthIndex + 1, 0).getDate();
      periodString = `21 - ${lastDay} ${selectedMonth} ${selectedYear}`;
    } else {
      periodString = `01 - ${new Date(selectedYear, MONTHS.indexOf(selectedMonth) + 1, 0).getDate()} ${selectedMonth} ${selectedYear}`;
    }

    // Generate Judul Otomatis
    const typeLabel = type === "HTH" ? "Hari Tanpa Hujan (HTH)" 
                    : type === "HujanDasarian" ? "Analisis Curah Hujan" 
                    : type === "PotensiBanjir" ? "Potensi Banjir" 
                    : "Informasi Iklim";
    
    const titleString = `${typeLabel} - ${selectedDasarian} ${selectedMonth} ${selectedYear}`;

    setAutoPeriod(periodString);
    setAutoTitle(titleString);

  }, [selectedDasarian, selectedMonth, selectedYear, type]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
        alert("Gambar terlalu besar! Maksimal 2 MB.");
        e.target.value = "";
        return;
    }
    setUploading(true);
    const fileName = `climate-${type}-${Date.now()}-${file.name}`;
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
    formData.append("type", type);
    formData.set("title", autoTitle);
    formData.set("period", autoPeriod);
    formData.set("bulan", `${selectedMonth} ${selectedYear}`);
    formData.set("dasarian", selectedDasarian);
    
    if (isEditMode && initialData) {
      await updateClimateData(initialData.id, formData);
    } else {
      await createClimateData(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-gray-200">
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-green-600" />
        {isEditMode ? "Edit Data Iklim" : "Input Data Iklim Baru"}
      </h1>
      
      <form action={handleSubmit} className="space-y-8">
        
        {/* AREA Selector */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> Generator Periode Otomatis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Pilih Dasarian */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Dasarian / Tipe</label>
                    <select 
                        value={selectedDasarian}
                        onChange={(e) => setSelectedDasarian(e.target.value)}
                        className="w-full p-2.5 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    >
                        {DASARIANS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* 2. Pilih Bulan */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Bulan</label>
                    <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full p-2.5 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    >
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* 3. Input Tahun */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tahun</label>
                    <input 
                        type="number" 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full p-2.5 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                </div>
            </div>
        </div>

        {/* PREVIEW HASIL GENERATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-500">Judul Lengkap (Otomatis)</label>
                <input 
                    type="text" 
                    name="title" 
                    value={autoTitle}
                    readOnly
                    className="w-full p-2 bg-gray-100 border rounded-lg text-gray-600 cursor-not-allowed font-medium"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-500">Periode Tanggal (Otomatis)</label>
                <input 
                    type="text" 
                    name="period" 
                    value={autoPeriod}
                    readOnly
                    className="w-full p-2 bg-gray-100 border rounded-lg text-gray-600 cursor-not-allowed font-medium"
                />
            </div>
        </div>

        {/* UPLOAD PETA */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
            <label className="block text-sm font-medium mb-3 text-gray-700">Upload Peta Visualisasi</label>
            
            {imageUrl ? (
                <div className="relative mb-4 group">
                    <img src={imageUrl} alt="Preview" className="h-64 mx-auto object-contain rounded-lg shadow-sm border border-gray-200" />
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                </div>
            ) : (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-lg mb-4 border border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                </div>
            )}
            
            <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm inline-block">
                {uploading ? "Mengupload..." : (imageUrl ? "Ganti Peta" : "Pilih Peta")}
                <input type="file" onChange={handleUpload} accept="image/*" className="hidden" disabled={uploading} />
            </label>
            <p className="text-xs text-gray-400 mt-2">Maks. 2 MB (JPG/PNG)</p>
        </div>

        {/* EDITOR ANALISIS */}
        <div>
          <label className="block text-sm font-medium mb-1">Analisis Klimatologis</label>
          <RichTextEditor content={content} onChange={(newHtml) => setContent(newHtml)} />
          <input type="hidden" name="content" value={content} />
        </div>

        <button type="submit" disabled={uploading || !imageUrl} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50">
           {isEditMode ? "Simpan Perubahan" : "Terbitkan Data"}
        </button>

      </form>
    </div>
  );
}