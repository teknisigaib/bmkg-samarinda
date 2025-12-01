import ClimateForm from "@/components/component-admin/IklimForm";
import { CLIMATE_TYPES } from "@/lib/climate-types";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ kategori: string }>;
}

export default async function TambahDataIklim({ params }: PageProps) {
  const { kategori } = await params;
  const config = CLIMATE_TYPES[kategori];

  if (!config) return notFound();

  return (
    <ClimateForm 
        type={config.dbType} // Kirim tipe database (misal: PrakiraanHujanDasarian)
        redirectUrl={`/admin/iklim/${kategori}`} // Kirim URL balik
    />
  );
}