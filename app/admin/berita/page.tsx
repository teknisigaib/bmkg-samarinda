import prisma from "@/lib/prisma";
import NewsPageClient from "@/components/component-admin/NewsPageClient";

export const dynamic = "force-dynamic";

export default async function AdminBeritaPage() {
  const posts = await prisma.post.findMany({ 
      orderBy: { createdAt: "desc" } 
  });

  return <NewsPageClient initialPosts={posts} />;
}