import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Pencil, FileBarChart } from "lucide-react"; // Hapus import Trash
import { notFound } from "next/navigation";
import { CLIMATE_TYPES } from "@/lib/climate-types"; 
import DeleteClimateButton from "./delete-button"; // <--- 1. Import komponen baru

interface PageProps {
  params: Promise<{ kategori: string }>;
}

// HAPUS fungsi DeleteButton lama yang ada di sini...

export default async function AdminClimateDynamicPage({ params }: PageProps) {
  const { kategori } = await params;
  
  const config = CLIMATE_TYPES[kategori];
  if (!config) return notFound();

  const data = await prisma.climateData.findMany({
    where: { type: config.dbType },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-600" />
            Kelola: {config.title}
        </h1>
        <Link 
            href={`/admin/iklim/${kategori}/baru`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" /> Input Data Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Periode</th>
              <th className="p-4">Judul</th>
              <th className="p-4">Update</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap">
                    <span className="font-bold text-gray-800 block">{item.dasarian}</span>
                    <span className="text-xs text-gray-500">{item.bulan}</span>
                </td>
                <td className="p-4 font-medium text-gray-700 truncate max-w-md">{item.title}</td>
                <td className="p-4 text-gray-500">{item.createdAt.toLocaleDateString('id-ID')}</td>
                <td className="p-4 flex justify-center gap-2">
                  <Link href={`/admin/iklim/${kategori}/${item.id}/edit`} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  
                  {/* 2. Panggil Komponen Client di sini */}
                  <DeleteClimateButton id={item.id} />
                  
                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada data untuk kategori ini.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}