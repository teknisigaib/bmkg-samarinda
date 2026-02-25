import type { Metadata } from "next"; 
import { getPdieData } from "@/app/(admin)/admin/peringatan-dini/actions"; 
import PeringatanDiniClient from "@/components/component-iklim/PeringatanDiniClient"; 

export const metadata: Metadata = {
  title: "Peringatan Dini Iklim Ekstrem (PDIE) | Stasiun Meteorologi APT Pranoto Samarinda",
  description: "Peringatan Dini Curah Hujan Tinggi dan Peringatan Dini Kekeringan Meteorologis di wilayah Kalimantan Timur.",
};

export const dynamic = 'force-dynamic'; 

export default async function PeringatanDiniPage() {
  const dbData = await getPdieData();

  return (
    <PeringatanDiniClient initialDbData={dbData} />
  );
}