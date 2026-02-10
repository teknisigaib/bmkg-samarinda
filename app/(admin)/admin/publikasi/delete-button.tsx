"use client"; // <--- Wajib ada

import { Trash } from "lucide-react";
import { deletePublication } from "@/app/(admin)/admin/actions"; // Import action deletePublication

export default function DeletePublicationButton({ id }: { id: string }) {
  return (
    <form action={deletePublication.bind(null, id)}>
      <button
        type="submit"
        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
        onClick={(e) => {
          // Konfirmasi di browser
          if (!confirm("Hapus publikasi ini? Data tidak bisa dikembalikan.")) {
            e.preventDefault();
          }
        }}
        title="Hapus Publikasi"
      >
        <Trash className="w-4 h-4" />
      </button>
    </form>
  );
}