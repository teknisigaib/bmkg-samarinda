import { PublikasiListPageSkeleton } from "@/components/component-publikasi/Skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <PublikasiListPageSkeleton />
      </div>
    </div>
  );
}