"use client";

import { useState } from "react";
import { Plus, Pencil, FileText, BookOpen, Layers } from "lucide-react";
import PublicationForm from "./PublicationForm";
import { useRouter } from "next/navigation";
import GlobalDeleteButton from "@/components/component-admin/GlobalDeleteButton";

interface PublicationClientProps {
  data: any[];
}

export default function PublicationClient({ data }: PublicationClientProps) {
  // --- STATE TAB BARU ---
  const [activeTab, setActiveTab] = useState<"Buletin" | "ArtikelMakalah">("Buletin");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const router = useRouter();

  // --- FILTER DATA BERDASARKAN TAB ---
  const filteredData = data.filter((item) => {
    if (activeTab === "Buletin") return item.type === "Buletin";
    return item.type === "Artikel" || item.type === "Makalah";
  });

  const handleCreateNew = () => {
    setSelectedData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedData(item);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleSuccess = () => {
    handleClose();
    router.refresh(); 
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Kelola Publikasi</h1>
           <p className="text-slate-500 text-sm">Upload Buletin, Artikel, dan Makalah ilmiah.</p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-bold shadow-sm transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Upload {activeTab === "Buletin" ? "Buletin" : "Artikel"} Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* --- TOMBOL TAB --- */}
        <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
                onClick={() => setActiveTab("Buletin")} 
                className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "Buletin" ? "bg-white text-blue-700 border-b-2 border-blue-600" : "text-slate-500 hover:bg-white hover:text-slate-700"}`}
            >
                <BookOpen className="w-4 h-4" /> Buletin 
            </button>
            <button 
                onClick={() => setActiveTab("ArtikelMakalah")} 
                className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "ArtikelMakalah" ? "bg-white text-orange-700 border-b-2 border-orange-600" : "text-slate-500 hover:bg-white hover:text-slate-700"}`}
            >
                <Layers className="w-4 h-4" /> Artikel & Makalah
            </button>
        </div>

        {/* TABLE */}
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Judul Dokumen</th>
              {activeTab === "Buletin" ? <th className="p-4">Edisi</th> : <th className="p-4">Tipe & Penulis</th>}
              <th className="p-4">Tahun</th>
              <th className="p-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.type === 'Buletin' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="truncate max-w-xs md:max-w-sm font-bold" title={item.title}>{item.title}</span>
                    </div>
                </td>
                
                {/* Kolom Dinamis berdasarkan Tab */}
                {activeTab === "Buletin" ? (
                    <td className="p-4 text-slate-600 font-medium">{item.edition || "-"}</td>
                ) : (
                    <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border mr-2 ${item.type === 'Artikel' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                            {item.type}
                        </span>
                        <span className="text-xs text-slate-500">{item.author}</span>
                    </td>
                )}

                <td className="p-4 text-slate-500 font-mono text-xs">{item.year}</td>
                <td className="p-4 flex justify-center items-center gap-1">
                  <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  
                  {/* TOMBOL HAPUS GLOBAL */}
                  <GlobalDeleteButton 
                    id={item.id} 
                    model="publication" 
                    fileUrl={item.pdfUrl} 
                    bucketName="bmkg-public" 
                    revalidateUrl="/admin/publikasi" 
                  />
                </td>
              </tr>
            ))}
             {filteredData.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400">
                        Belum ada dokumen di kategori {activeTab === "Buletin" ? "Buletin" : "Artikel/Makalah"}.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <PublicationForm 
            initialData={selectedData} 
            activeTab={activeTab} // <-- Kirim konteks tab ke Form
            onClose={handleClose} 
            onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}