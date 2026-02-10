"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Terjadi Kesalahan Sistem</h2>
      <p className="text-gray-600 mb-6">Kami mengalami kendala saat memuat data. Silakan coba lagi.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
      >
        Coba Lagi
      </button>
    </div>
  );
}