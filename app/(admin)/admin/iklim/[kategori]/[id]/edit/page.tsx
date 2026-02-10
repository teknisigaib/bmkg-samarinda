import prisma from "@/lib/prisma";
import ClimateForm from "@/components/component-admin/IklimForm";
import { CLIMATE_TYPES } from "@/lib/climate-types";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ kategori: string; id: string }>;
}

export default async function EditDataIklim({ params }: PageProps) {
  const { kategori, id } = await params;
  const config = CLIMATE_TYPES[kategori];

  if (!config) return notFound();

  const data = await prisma.climateData.findUnique({ where: { id } });
  
  if (!data) notFound();

  return (
    <ClimateForm 
        type={config.dbType} 
        redirectUrl={`/admin/iklim/${kategori}`} 
        initialData={data} 
    />
  );
}