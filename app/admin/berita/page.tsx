import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Trash, Pencil } from "lucide-react";
import DeleteButton from "./delete-button";
import FeaturedToggle from "./featured-toggle";

export default async function AdminBeritaPage() {
  // Ambil data (tetap di server)
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Berita</h1>
        <Link href="/admin/berita/baru" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium">
          <Plus className="w-4 h-4" /> Tambah Berita
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4 text-center w-16">Utama</th>
              <th className="p-4 font-semibold">Judul</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Tanggal</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center">
                  <FeaturedToggle id={post.id} isFeatured={post.isFeatured} />
                </td>
                <td className="p-4 font-medium text-gray-900 max-w-md truncate" title={post.title}>
                    {post.title}
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        post.category === 'Kegiatan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {post.category}
                    </span>
                </td>
                <td className="p-4 text-gray-500 whitespace-nowrap">
                    {post.createdAt.toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 flex items-center gap-2 justify-center">
                  {/* TOMBOL EDIT (Link ke halaman edit) */}
                  <Link 
                    href={`/admin/berita/${post.id}/edit`} 
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                    title="Edit Berita"
                  >
                  <Pencil className="w-4 h-4" />
                  </Link>

                  {/* TOMBOL DELETE (Yang sudah ada) */}
                  <DeleteButton id={post.id} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                        Belum ada berita. Silakan tambah berita baru.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}