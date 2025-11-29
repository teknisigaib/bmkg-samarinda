import prisma from "@/lib/prisma";
import PostForm from "@/components/component-admin/PostForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBeritaPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Ambil data lama dari database
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // 2. Lempar data ke Form (Form otomatis masuk Mode Edit)
  return <PostForm initialData={post} />;
}