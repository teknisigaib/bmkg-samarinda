"use client"; // Error components harus Client Component

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opsional: Log error ke service monitoring (Sentry, dll)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Terjadi Kesalahan Memuat Data
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        Mohon maaf, kami tidak dapat mengambil data publikasi saat ini. Silakan coba muat ulang halaman.
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
      >
        <RotateCcw className="w-4 h-4" /> Coba Lagi
      </button>
    </div>
  );
}