"use client";

import type { WeatherResponse } from "@/lib/bmkg/cuaca";

export default function PrakiraanViewer({ data }: { data: WeatherResponse }) {
  return (
    <div className="w-full p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
      <h2 className="text-xl font-bold text-gray-400">Mode Perancangan Ulang</h2>
      <p className="text-gray-400 mt-2">Komponen siap untuk dibangun kembali dari nol.</p>
    </div>
  );
}