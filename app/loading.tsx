import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">
      
      {/* 1. SKELETON HEADER */}
      <div className="flex flex-col gap-2">
        {/* Kotak judul */}
        <Skeleton className="h-8 w-64" /> 
        {/* Kotak sub-judul */}
        <Skeleton className="h-4 w-48" />
      </div>

      {/* 2. SKELETON GRID DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Simulasi Widget AWOS (Besar) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[300px] flex flex-col gap-4">
            <div className="flex justify-between">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon */}
                <Skeleton className="h-6 w-20" /> {/* Status */}
            </div>
            <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-24 w-48" /> {/* Angka Besar */}
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>

        {/* Card 2: Simulasi Widget Prakiraan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[300px] space-y-4">
             <Skeleton className="h-6 w-32 mb-4" /> {/* Judul Widget */}
             {/* List baris cuaca */}
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" /> {/* Jam */}
                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon Cuaca */}
                    <Skeleton className="h-4 w-16" /> {/* Suhu */}
                </div>
             ))}
        </div>

        {/* Card 3: Simulasi Widget Satelit/Peta */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 h-[300px]">
            <Skeleton className="h-full w-full rounded-xl" />
        </div>

      </div>
    </main>
  );
}