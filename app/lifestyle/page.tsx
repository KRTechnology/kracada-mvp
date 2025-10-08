import { LifestyleListingSection } from "@/components/specific/lifestyle/LifestyleListingSection";
import { getLifestylePostsAction } from "@/app/actions/lifestyle-actions";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function LifestylePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  // Fetch posts from database
  const postsResult = await getLifestylePostsAction({
    page,
    limit: 6,
    status: "published",
  });

  const posts = postsResult.success ? postsResult.data?.posts || [] : [];
  const pagination = postsResult.success
    ? postsResult.data?.pagination
    : { page: 1, limit: 6, total: 0, totalPages: 0 };

  return (
    <LifestyleListingSection
      activeTab="All posts"
      initialPosts={posts}
      initialPagination={pagination}
    />
  );
}
