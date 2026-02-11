import { Skeleton } from "@/components/ui/skeleton";

const NewsCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden space-y-3 shadow-sm">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
        <div className="flex gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

// Kartu Buletin/Artikel 
const PortraitCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
     <div className="relative aspect-[3/4]">
        <Skeleton className="h-full w-full rounded-none" />
     </div>
     <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-24 mt-2" />
     </div>
  </div>
);

// List Makalah
const ListRowSkeleton = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
      {/* Side Accent Line */}
      <Skeleton className="w-full md:w-1.5 h-1.5 md:h-auto rounded-full" />
      
      <div className="w-full space-y-3">
          <div className="flex justify-between">
             <Skeleton className="h-5 w-24 rounded-md" />
             <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/4" /> 
          <Skeleton className="h-4 w-40" /> 
          <Skeleton className="h-12 w-full" /> 
          <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-md" /> 
              <Skeleton className="h-6 w-16 rounded-md" />
          </div>
      </div>
  </div>
);


export function BeritaPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header Title */}
      <div className="flex flex-col items-center gap-4">
         <Skeleton className="h-10 w-64" />
         <Skeleton className="h-4 w-96" />
      </div>

      {/* Hero Section */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white grid md:grid-cols-2">
         <Skeleton className="h-64 md:h-80 w-full rounded-none" />
         <div className="p-8 space-y-4 justify-center flex flex-col">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
         </div>
      </div>

      {/* Grid News */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => <NewsCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function BuletinPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
         <Skeleton className="h-10 w-48" />
         <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center">
         <Skeleton className="h-12 w-64 rounded-xl" />
      </div>

      {/* Grid Portrait */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => <PortraitCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function PublikasiListPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
         <Skeleton className="h-10 w-72" />
         <Skeleton className="h-4 w-96" />
      </div>

      {/* Controls (Tabs & Search) */}
      <div className="space-y-6 max-w-3xl mx-auto w-full">
         <div className="flex justify-center">
             <Skeleton className="h-10 w-80 rounded-xl" />
         </div>
         <Skeleton className="h-12 w-full rounded-full" />
      </div>

      {/* List Vertical */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <ListRowSkeleton key={i} />)}
      </div>
    </div>
  );
}