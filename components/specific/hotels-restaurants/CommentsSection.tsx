"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  createReviewAction,
  getReviewsAction,
  toggleReviewLikeAction,
} from "@/app/(dashboard)/actions/review-actions";
import { ReviewWithUser } from "@/lib/db/schema";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface CommentsSectionProps {
  itemId: string;
  itemType: "hotel" | "restaurant";
}

export const CommentsSection = ({ itemId, itemType }: CommentsSectionProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsPerPage = 5;

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      const result = await getReviewsAction(itemType, itemId, 1, 100); // Fetch more reviews
      if (result.success && result.data) {
        setReviews(result.data);
      } else {
        console.error("Failed to fetch reviews:", result.message);
      }
      setIsLoadingReviews(false);
    };

    fetchReviews();
  }, [itemId, itemType]);

  const totalPages = Math.ceil(reviews.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const currentComments = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLike = async (reviewId: string) => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      toast.error("Please sign in to like reviews");
      router.push("/login");
      return;
    }

    const result = await toggleReviewLikeAction(reviewId);
    if (result.success) {
      // Refresh reviews to get updated like counts
      const refreshResult = await getReviewsAction(itemType, itemId, 1, 100);
      if (refreshResult.success && refreshResult.data) {
        setReviews(refreshResult.data);
      }
    } else {
      toast.error(result.message || "Failed to update like");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a review");
      return;
    }

    // Check if user is authenticated for rating (stars)
    if (status === "unauthenticated") {
      toast.error("Please sign in to leave a rating and review");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReviewAction({
        contentId: itemId,
        contentType: itemType,
        rating: newRating,
        comment: newComment,
      });

      if (result.success && result.data) {
        toast.success("Review posted successfully!");
        setNewComment("");
        setNewRating(5);

        // Refresh reviews
        const refreshResult = await getReviewsAction(itemType, itemId, 1, 100);
        if (refreshResult.success && refreshResult.data) {
          setReviews(refreshResult.data);
        }
      } else {
        toast.error(result.message || "Failed to post review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingReviews) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warm-200"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        Reviews & Comments ({reviews.length})
      </h2>

      {/* Add Comment Form */}
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Leave a review
        </h3>

        {status === "unauthenticated" && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Please{" "}
              <button
                onClick={() => router.push("/login")}
                className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-100"
              >
                sign in
              </button>{" "}
              to leave a rating and review.
            </p>
          </div>
        )}

        {/* Rating Input */}
        {status === "authenticated" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                {newRating} star{newRating !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Comment Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Your review
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Share your experience with this ${itemType}...`}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 resize-none"
          />
        </div>

        <button
          onClick={handleSubmitComment}
          disabled={
            !newComment.trim() || isSubmitting || status === "unauthenticated"
          }
          className="bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </div>

      {/* Comments List */}
      {currentComments.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          No reviews yet. Be the first to leave a review!
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {currentComments.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                      {review.user.profilePicture ? (
                        <Image
                          src={review.user.profilePicture}
                          alt={review.user.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-neutral-500 dark:text-neutral-400">
                          {review.user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          {review.user.fullName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-neutral-300 dark:text-neutral-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Comment Content */}
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    disabled={status === "unauthenticated"}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      review.isLikedByCurrentUser
                        ? "bg-warm-100 dark:bg-warm-900/20 text-warm-200"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${review.isLikedByCurrentUser ? "fill-current" : ""}`}
                    />
                    <span className="text-sm font-medium">
                      {review.likesCount}
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </motion.div>
  );
};
