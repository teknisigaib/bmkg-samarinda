"use client";

import dynamic from "next/dynamic";
import { HotspotData } from "@/lib/data-karhutla";

// Import Map secara Dynamic DI SINI (Client Side)
const HotspotMap = dynamic(() => import("./HotspotMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-red-50 animate-pulse rounded-2xl flex items-center justify-center text-red-300 font-bold">
      Memuat Peta Sebaran...
    </div>
  ),
});

export default function HotspotMapWrapper({ data }: { data: HotspotData[] }) {
  return <HotspotMap data={data} />;
}