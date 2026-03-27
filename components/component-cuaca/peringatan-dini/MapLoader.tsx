"use client"; 

import dynamic from "next/dynamic";
import React from "react";

const WarningMap = dynamic(
  () => import("./WarningMap"), 
  {
    ssr: false, 
    loading: () => (
      <div className="h-[400px] md:h-[550px] lg:h-[600px] w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
        Memuat Peta...
      </div>
    )
  }
);

export default function MapLoader({ data }: { data: any }) {
  return <WarningMap data={data} />;
}