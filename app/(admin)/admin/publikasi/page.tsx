export const dynamic = 'force-dynamic';
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Pencil, FileText } from "lucide-react"; // Hapus import Trash dari sini
import DeletePublicationButton from "./delete-button"; // <--- 1. Import komponen baru

export default async function AdminPublikasiPage() {
  const data = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Publikasi</h1>
        <Link href="/admin/publikasi/baru" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium">
          <Plus className="w-4 h-4" /> Upload Baru
        </Link>
      </div>

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
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-xs" title={item.title}>{item.title}</span>
                    </div>
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.type === 'Buletin' ? 'bg-green-100 text-green-700' : 
                        item.type === 'Artikel' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {item.type}
                    </span>
                </td>
                <td className="p-4 text-gray-500">{item.year}</td>
                <td className="p-4 flex justify-center gap-2">
                  <Link href={`/admin/publikasi/${item.id}/edit`} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  
                  {/* 2. Panggil Komponen Client di sini */}
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
    </div>
  );
}