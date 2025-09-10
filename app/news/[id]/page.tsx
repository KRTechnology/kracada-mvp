import { NewsArticleHeader } from "@/components/specific/news/NewsArticleHeader";
import { NewsArticleContent } from "@/components/specific/news/NewsArticleContent";

interface NewsArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <NewsArticleHeader />
      <NewsArticleContent />
    </div>
  );
}
