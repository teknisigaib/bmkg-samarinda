"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Panggil komponen peta aslinya di sini dengan ssr: false
const WarningMap = dynamic(() => import("./WarningMap"), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-400">Memuat Radar Peta...</span>
        </div>
    )
});

// Namanya sudah diganti jadi Wrapper
export default function WarningMapWrapper({ data }: { data: any }) {
  return <WarningMap data={data} />;
}