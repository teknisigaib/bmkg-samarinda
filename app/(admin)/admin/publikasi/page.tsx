export const dynamic = 'force-dynamic';
import prisma from "@/lib/prisma";
import PublicationClient from "@/components/component-admin/PublicationClient";

export default async function AdminPublikasiPage() {
  // Ambil data dari database
  const data = await prisma.publication.findMany({ 
      orderBy: { createdAt: "desc" } 
  });

  // Oper data ke Client Component
  return (
      <PublicationClient data={data} />
  );
}