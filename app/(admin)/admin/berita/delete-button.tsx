"use client"; // <--- INI KUNCINYA

import { Trash } from "lucide-react";
import { deletePost } from "../actions"; // Import Server Action kita

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deletePost.bind(null, id)}>
      <button
        type="submit"
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
        onClick={(e) => {
          // Konfirmasi browser
          if (!confirm("Apakah Anda yakin ingin menghapus berita ini? Data yang dihapus tidak bisa dikembalikan.")) {
            e.preventDefault(); // Batalkan submit jika user klik Cancel
          }
        }}
        title="Hapus Berita"
      >
        <Trash className="w-4 h-4" />
      </button>
    </form>
  );
}