"use client"; // <--- Wajib ada di sini

import dynamic from "next/dynamic";
import React from "react";

// Pindahkan logika dynamic import ke sini
const WarningMap = dynamic(
  () => import("./WarningMap"), 
  {
    ssr: false, // Sekarang valid karena berada di Client Component
    loading: () => (
      <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
        Memuat Peta...
      </div>
    )
  }
);

// Wrapper sederhana untuk meneruskan props
export default function MapLoader({ data }: { data: any }) {
  return <WarningMap data={data} />;
}