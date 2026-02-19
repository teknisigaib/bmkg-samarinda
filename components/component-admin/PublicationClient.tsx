"use client";

import { useState } from "react";
import { Plus, Pencil, FileText } from "lucide-react";
import DeletePublicationButton from "@/app/(admin)/admin/publikasi/delete-button";
import PublicationForm from "./PublicationForm";
import { useRouter } from "next/navigation";

interface PublicationClientProps {
  data: any[];
}

export default function PublicationClient({ data }: PublicationClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const router = useRouter();

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
    router.refresh(); // Refresh data tabel setelah sukses
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Kelola Publikasi</h1>
           <p className="text-gray-500 text-sm">Upload Buletin, Artikel, dan Dokumen.</p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload Baru
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Judul</th>
              <th className="p-4">Tipe</th>
              <th className="p-4">Tahun</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="truncate max-w-xs md:max-w-md" title={item.title}>{item.title}</span>
                    </div>
                </td>
                <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                        item.type === 'Buletin' ? 'bg-green-50 text-green-700 border-green-200' : 
                        item.type === 'Artikel' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                        {item.type}
                    </span>
                </td>
                <td className="p-4 text-gray-500">{item.year}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <DeletePublicationButton id={item.id} />
                </td>
              </tr>
            ))}
             {data.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                        Belum ada publikasi.
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
            onClose={handleClose} 
            onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}