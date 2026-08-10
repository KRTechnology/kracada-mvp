import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntertainmentPostAction } from "@/app/actions/entertainment-actions";
import { LifestyleArticlePageClient } from "@/components/specific/lifestyle/LifestyleArticlePageClient";

interface LifestyleArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LifestyleArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  console.log("id", id);
  const result = await getEntertainmentPostAction(id);

  if (!result.success || !result.data) {
    return {
      title: "Post Not Found | Kracada",
    };
  }

  const post = result.data;

  return {
    title: `${post.title} | Kracada Entertainment`,
    description: post.description || post.content.substring(0, 160),
  };
}

export default async function LifestyleArticlePage({
  params,
}: LifestyleArticlePageProps) {
  const { id } = await params;

  // Fetch post from database
  const result = await getEntertainmentPostAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  // Check if the post is not published (unless user is the author)
  if (post.status !== "published") {
    // TODO: Add author check to allow authors to view their own drafts
    notFound();
  }

  return <LifestyleArticlePageClient post={post} />;
}
