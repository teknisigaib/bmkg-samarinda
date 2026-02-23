export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import AdminFlyerClient from "./AdminFlyerClient";

export default async function AdminFlyerPage() {
  // Ambil semua data flyer, urutkan dari yang terbaru
  const flyers = await prisma.flyer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Manajemen Banner / Flyer</h1>
      <AdminFlyerClient flyers={flyers} />
    </div>
  );
}