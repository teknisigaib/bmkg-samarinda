import { BeritaSkeleton } from "@/components/component-publikasi/Skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Statis (Biar judul tidak ikut loading/hilang) */}
        <div className="text-center mb-12 space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        
        {/* Panggil Skeleton Grid */}
        <BeritaSkeleton />
      </div>
    </div>
  );
}