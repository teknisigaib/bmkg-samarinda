"use client"; 

import dynamic from "next/dynamic";
import React from "react";

const WarningMap = dynamic(
  () => import("./WarningMap"), 
  {
    ssr: false, 
    loading: () => (
      <div className="h-[400px] md:h-[600px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
        Memuat Peta...
      </div>
    )
  }
);

export default function MapLoader({ data }: { data: any }) {
  return <WarningMap data={data} />;
}