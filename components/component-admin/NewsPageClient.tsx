"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PostList from "./PostList";
import PostForm, { PostData } from "./PostForm";
import { useRouter } from "next/navigation";

interface Props { initialPosts: any[]; }

export default function NewsPageClient({ initialPosts }: Props) {
  // View mode sekarang: "list" adalah default. "form" hanya state boolean "isModalOpen" sebenarnya.
  // Tapi kita tetap pakai 'view' agar konsisten dengan logika sebelumnya.
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const router = useRouter();

  const handleCreate = () => {
    setSelectedPost(null);
    setView("form");
  };

  const handleEdit = (post: any) => {
    setSelectedPost({
        id: post.id,
        title: post.title,
        author: post.author,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt 
    });
    setView("form");
  };

  const handleSuccess = () => {
    setView("list");
    router.refresh(); 
  };

  return (
    <div className="space-y-6 relative"> 
      {/* HEADER PAGE (Selalu Tampil) */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Berita</h1>
            <p className="text-gray-500 text-sm">Daftar semua publikasi berita & kegiatan.</p>
        </div>
        <button 
            onClick={handleCreate} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md"
        >
            <Plus className="w-4 h-4" /> Tambah Berita
        </button>
      </div>

      {/* LIST BERITA (Selalu Tampil di background) */}
      <PostList data={initialPosts} onEdit={handleEdit} />

      {/* MODAL FORM (Muncul di atas List jika view === 'form') */}
      {view === "form" && (
        <PostForm 
            initialData={selectedPost} 
            onCancel={() => setView("list")} 
            onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}