"use client";

import { useState } from "react";
import { Plus, Pencil, FileBarChart } from "lucide-react";
import ClimateForm from "./IklimForm";
import { useRouter } from "next/navigation";
import GlobalDeleteButton from "@/components/component-admin/GlobalDeleteButton"; // IMPORT TOMBOL GLOBAL

interface IklimClientProps {
  data: any[];
  config: any;
  kategori: string;
}

export default function IklimClient({ data, config, kategori }: IklimClientProps) {
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
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <FileBarChart className="w-6 h-6 text-blue-600" />
             Kelola: {config.title}
           </h1>
           <p className="text-gray-500 text-sm">Manajemen data iklim {config.title.toLowerCase()}.</p>
        </div>
        <button 
          onClick={handleCreateNew} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Input Data Baru
        </button>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Periode</th>
              <th className="p-4">Judul Lengkap</th>
              <th className="p-4">Update</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 whitespace-nowrap">
                    <span className="font-bold text-gray-800 block">{item.dasarian}</span>
                    <span className="text-xs text-gray-500">{item.bulan}</span>
                </td>
                <td className="p-4 font-medium text-gray-700 truncate max-w-md">{item.title}</td>
                <td className="p-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* --- TOMBOL HAPUS GLOBAL --- */}
                  <GlobalDeleteButton 
                    id={item.id} 
                    model="iklim" 
                    fileUrl={item.imageUrl} // Pastikan ini sesuai dengan nama kolom Peta Anda di database
                    bucketName="bmkg-public" 
                    revalidateUrl={`/admin/iklim/${kategori}`} // Refresh route spesifik ini
                  />
                  {/* ------------------------- */}
                  
                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <ClimateForm 
            type={config.dbType} 
            initialData={selectedData} 
            onClose={handleClose} 
            onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}