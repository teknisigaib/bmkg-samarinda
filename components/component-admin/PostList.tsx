import { Pencil } from "lucide-react";
import FeaturedToggle from "@/app/(admin)/admin/berita/featured-toggle";
import GlobalDeleteButton from "@/components/component-admin/GlobalDeleteButton"; // Sesuaikan path jika berbeda

interface PostListProps {
    data: any[];
    onEdit: (post: any) => void;
}

export default function PostList({ data, onEdit }: PostListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          {/* ... THEAD TETAP SAMA ... */}
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
            {data.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center">
                  <FeaturedToggle id={post.id} isFeatured={post.isFeatured} />
                </td>
                <td className="p-4 font-medium text-gray-900 max-w-md truncate">{post.title}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        post.category === 'Kegiatan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {post.category}
                    </span>
                </td>
                <td className="p-4 text-gray-500 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </td>
                <td className="p-4 flex items-center gap-2 justify-center">
                  <button 
                    onClick={() => onEdit(post)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                    title="Edit Berita"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  
                  {/* --- TOMBOL HAPUS BARU --- */}
                  <GlobalDeleteButton 
                    id={post.id} 
                    model="post" 
                    fileUrl={post.imageUrl} 
                    bucketName="bmkg-public" 
                    revalidateUrl="/admin/berita" // Sesuaikan URL halaman admin berita Anda
                  />
                  {/* ------------------------- */}

                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada berita.</td></tr>
            )}
          </tbody>
        </table>
      </div>
  );
}