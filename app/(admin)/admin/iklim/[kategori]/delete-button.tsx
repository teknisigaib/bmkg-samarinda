"use client"; // <--- Wajib ada

import { Trash } from "lucide-react";
import { deleteClimateData } from "@/app/(admin)/admin/iklim-actions"; // Import server action

export default function DeleteClimateButton({ id }: { id: string }) {
  return (
    <form action={deleteClimateData.bind(null, id)}>
      <button
        type="submit"
        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
        onClick={(e) => {
          // Konfirmasi browser (Client Side Interactivity)
          if (!confirm("Apakah Anda yakin ingin menghapus data iklim ini?")) {
            e.preventDefault();
          }
        }}
        title="Hapus Data"
      >
        <Trash className="w-4 h-4" />
      </button>
    </form>
  );
}