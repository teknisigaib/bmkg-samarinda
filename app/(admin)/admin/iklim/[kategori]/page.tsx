export const dynamic = 'force-dynamic'; 
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CLIMATE_TYPES } from "@/lib/climate-types"; 
import IklimClient from "@/components/component-admin/IklimClient";

interface PageProps {
  params: Promise<{ kategori: string }>;
}

export default async function AdminClimateDynamicPage({ params }: PageProps) {
  const { kategori } = await params;
  
  const config = CLIMATE_TYPES[kategori];
  if (!config) return notFound();

  const data = await prisma.climateData.findMany({
    where: { type: config.dbType },
    orderBy: { createdAt: "desc" }
  });

  return (
    <IklimClient data={data} config={config} kategori={kategori} />
  );
}