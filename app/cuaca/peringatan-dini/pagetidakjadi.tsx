"use client";

import { useEffect, useState } from "react";
import ImageModal from "@/components/component-cuaca/peringatan-dini/ImageModal";

export default function PeringatanPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/peringatan", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData({ error: "Gagal memuat data" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center">
        <div className="animate-pulse w-3/4 h-8 bg-gray-300 rounded mb-6" />
        <div className="animate-pulse w-1/2 h-4 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-700 p-4">Peringatan Dini Cuaca</h1>
        <p className="text-gray-600 mb-6">
          Informasi peringatan dini cuaca sementara tidak tersedia.
        </p>
        <div className="text-red-500">{data.error}</div>
      </div>
    );
  }

  const images = [
    { src: data.img, alt: "Infografis Peringatan Dini", caption: "Infografis Peringatan Dini" },
    { src: data.text, alt: "Teks Peringatan Dini", caption: "Teks Peringatan Dini" },
  ];

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Judul + Deskripsi */}
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-2">
        Peringatan Dini Cuaca
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mb-8">
        Halaman ini menampilkan <span className="font-semibold">informasi terbaru</span> 
        mengenai peringatan dini cuaca dari BMKG. Data berupa infografis dan teks resmi 
        yang diperbarui secara berkala.
      </p>

      {/* Grid Gambar */}
      <ImageModal images={images} />

      {/* Metadata update */}
      <p className="text-sm text-gray-500 mt-6">
        Terakhir diperbarui: {data.updated}{" "}
        {data.fromCache && "(cached)"}
      </p>
    </div>
  );
}
