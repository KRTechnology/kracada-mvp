import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsPostAction } from "@/app/(dashboard)/actions/news-actions";
import { NewsArticlePageClient } from "@/components/specific/news/NewsArticlePageClient";

interface NewsArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getNewsPostAction(id);

  if (!result.success || !result.data) {
    return {
      title: "Post Not Found | Kracada News",
    };
  }

  const post = result.data;

  return {
    title: `${post.title} | Kracada News`,
    description: post.description || post.content.substring(0, 160),
  };
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { id } = await params;

  // Fetch post from database
  const result = await getNewsPostAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  // Check if the post is not published
  if (post.status !== "published") {
    notFound();
  }

  return <NewsArticlePageClient post={post} />;
}
