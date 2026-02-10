import prisma from "@/lib/prisma";
import PublicationForm from "@/components/component-admin/PublicationForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPublikasi({ params }: PageProps) {
  const { id } = await params;
  const data = await prisma.publication.findUnique({ where: { id } });
  if (!data) notFound();
  return <PublicationForm initialData={data} />;
}