"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Flag,
  Trash2,
  MoreVertical,
  FileText,
  AlertTriangle,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAdminLifestylePostsAction,
  deleteLifestylePostAction,
  flagLifestylePostAction,
  archiveLifestylePostAction,
} from "@/app/(dashboard)/actions/lifestyle-management-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/common/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Spinner } from "@/components/common/spinner";
import { Pagination } from "@/components/specific/dashboard/Pagination";

interface LifestylePost {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  featuredImage: string | null;
  categories: string[];
  status: "draft" | "published" | "flagged" | "archived";
  authorId: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    fullName: string | null;
    email: string;
  } | null;
}

export default function LifestyleManagementContent() {
  const router = useRouter();
  const [posts, setPosts] = useState<LifestylePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<LifestylePost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    flagged: 0,
    archived: 0,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Fetch stats on mount and after actions
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch posts with server-side filtering and pagination
  useEffect(() => {
    fetchPosts();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const fetchStats = async () => {
    // Fetch all posts to get accurate counts
    const result = await getAdminLifestylePostsAction({ limit: 1000 });
    if (result.success && result.data) {
      const allPosts = result.data.posts;
      setStats({
        total: allPosts.length,
        published: allPosts.filter((p: any) => p.status === "published").length,
        draft: allPosts.filter((p: any) => p.status === "draft").length,
        flagged: allPosts.filter((p: any) => p.status === "flagged").length,
        archived: allPosts.filter((p: any) => p.status === "archived").length,
      });
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    const result = await getAdminLifestylePostsAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined,
      search: debouncedSearchTerm || undefined,
    });

    if (result.success && result.data) {
      setPosts(result.data.posts as LifestylePost[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);
    } else {
      toast.error("Failed to load lifestyle posts");
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: {
        label: "Draft",
        color:
          "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
      },
      published: {
        label: "Published",
        color:
          "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700",
      },
      flagged: {
        label: "Flagged",
        color:
          "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-700",
      },
      archived: {
        label: "Archived",
        color:
          "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-300 dark:border-orange-700",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleDeleteClick = (post: LifestylePost) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    const result = await deleteLifestylePostAction(postToDelete.id);

    if (result.success) {
      toast.success("Lifestyle post deleted successfully");
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
      fetchPosts();
      fetchStats();
    } else {
      toast.error(result.message || "Failed to delete lifestyle post");
    }
    setIsDeleting(false);
  };

  const handleFlagPost = async (post: LifestylePost) => {
    const result = await flagLifestylePostAction(post.id);

    if (result.success) {
      toast.success(result.message);
      fetchPosts();
      fetchStats();
    } else {
      toast.error(result.message || "Failed to flag post");
    }
  };

  const handleArchivePost = async (post: LifestylePost) => {
    const result = await archiveLifestylePostAction(post.id);

    if (result.success) {
      toast.success(result.message);
      fetchPosts();
      fetchStats();
    } else {
      toast.error(result.message || "Failed to archive post");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Lifestyle Management
          </h1>
          <p className="text-warm-50 text-lg">
            Manage lifestyle posts, moderate content, and review user
            submissions
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-warm-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Total Posts
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-warm-600 dark:text-warm-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-green-100 dark:border-green-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Published
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.published}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Drafts
              </p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.draft}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Flagged
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.flagged}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-orange-100 dark:border-orange-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Archived
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.archived}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by title, description, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="flagged">Flagged</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No lifestyle posts found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No lifestyle posts have been created yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-warm-200 dark:border-warm-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[28%]">
                    Title
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[12%]">
                    Author
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[18%]">
                    Stats
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[15%]">
                    Published
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-neutral-700">
                {posts.map((post, index) => (
                  <tr
                    key={post.id}
                    className={`hover:bg-warm-50/50 dark:hover:bg-neutral-800/50 transition-all duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-neutral-800"
                        : "bg-neutral-50/30 dark:bg-neutral-850/30"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/lifestyle/${post.id}`}
                          className="font-semibold text-neutral-900 dark:text-white hover:text-warm-600 dark:hover:text-warm-400 transition-colors line-clamp-2 leading-tight mb-1"
                        >
                          {post.title}
                        </Link>
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {post.categories.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="px-2 py-0.5 text-xs bg-gradient-to-r from-warm-100 to-orange-100 dark:from-warm-900/30 dark:to-orange-900/30 text-warm-700 dark:text-warm-300 rounded-md font-medium"
                              >
                                {category}
                              </span>
                            ))}
                            {post.categories.length > 2 && (
                              <span className="px-2 py-0.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                +{post.categories.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warm-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {post.author?.fullName
                            ? post.author.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)
                            : "U"}
                        </div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {post.author?.fullName || "Unknown"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(post.status)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                              {post.viewCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 rounded-md">
                            <span className="text-xs">❤️</span>
                            <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                              {post.likeCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
                            <span className="text-xs">💬</span>
                            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                              {post.commentCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {post.publishedAt
                            ? format(new Date(post.publishedAt), "MMM dd, yyyy")
                            : "Not published"}
                        </span>
                        {post.publishedAt && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {format(new Date(post.publishedAt), "h:mm a")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/lifestyle/${post.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleFlagPost(post)}
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            {post.status === "flagged" ? "Unflag" : "Flag"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleArchivePost(post)}
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            {post.status === "archived"
                              ? "Unarchive"
                              : "Archive"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(post)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-warm-100 dark:border-neutral-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lifestyle Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This
              action cannot be undone and will also delete all comments and
              likes associated with this post.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
