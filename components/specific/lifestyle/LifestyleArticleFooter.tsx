"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ThumbsUp,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/common/button";
import { Textarea } from "@/components/common/textarea";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  getLifestyleCommentsAction,
  createLifestyleCommentAction,
  toggleLifestylePostLikeAction,
  checkPostLikedAction,
} from "@/app/actions/lifestyle-actions";

interface LifestyleArticleFooterProps {
  postId: string;
}

export const LifestyleArticleFooter = ({
  postId,
}: LifestyleArticleFooterProps) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments and like status on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch comments
      const commentsResult = await getLifestyleCommentsAction(postId);
      if (commentsResult.success && commentsResult.data) {
        setComments(commentsResult.data);
      }
      setIsLoadingComments(false);

      // Check if user has liked the post
      if (session?.user?.id) {
        const likeResult = await checkPostLikedAction(postId);
        if (likeResult.success) {
          setLiked(likeResult.liked || false);
        }
      }
    };

    fetchData();
  }, [postId, session?.user?.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleLike = async () => {
    if (!session?.user?.id) {
      toast.error("Please log in to like this post");
      return;
    }

    try {
      const result = await toggleLifestylePostLikeAction(postId);
      if (result.success) {
        setLiked(result.liked || false);
        toast.success(result.liked ? "Post liked!" : "Post unliked!");
      } else {
        toast.error(result.message || "Failed to update like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("An error occurred");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    // If user is not logged in, require guest name
    if (!session?.user?.id && !guestName.trim()) {
      toast.error("Please provide your name");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createLifestyleCommentAction({
        postId,
        commentText: commentText.trim(),
        userName: !session?.user?.id ? guestName.trim() : undefined,
      });

      if (result.success && result.data) {
        // Add new comment to the list
        setComments((prev) => [result.data, ...prev]);
        setCommentText("");
        setGuestName("");
        toast.success("Comment posted successfully!");
      } else {
        toast.error(result.message || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-orange-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white dark:bg-[#0D0D0D]">
      <div className="container mx-auto px-4 py-8">
        {/* Disclaimer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          {/* Gray Disclaimer */}
          <div className="flex items-start gap-3 p-4 border border-[#D5D7DA] dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800/50">
            <AlertCircle className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                Disclaimer
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Kracada is not responsible for user-generated content. Posts are
                not pre-screened, and all responsibility lies with the original
                poster. Please report any content that violates our guidelines.
              </p>
            </div>
          </div>

          {/* Orange Warning */}
          <div className="flex items-start gap-3 p-4 border border-orange-200 dark:border-orange-800 rounded-xl bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                Kracada is not responsible for user-generated content. Posts are
                not pre-screened, and all responsibility lies with the original
                poster. Please report any content that violates our guidelines.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Social Sharing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Like Button */}
            <Button
              onClick={handleLike}
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${
                liked
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              Like
            </Button>

            {/* Copy Link Button */}
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Copy className="w-4 h-4" />
              {linkCopied ? "Copied!" : "Copy link"}
            </Button>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Comments Header */}
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Comments ({comments.length})
          </h3>

          {/* Comment Input Form */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {session?.user?.name
                  ? session.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </span>
            </div>
            <div className="flex-1 space-y-3">
              {/* Guest Name Input (only shown if not logged in) */}
              {!session?.user?.id && (
                <div>
                  <Label htmlFor="guest-name" className="text-sm mb-1">
                    Your Name
                  </Label>
                  <Input
                    id="guest-name"
                    placeholder="Enter your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  />
                </div>
              )}

              {session?.user?.id && (
                <div className="mb-2">
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {session.user.name}
                  </span>
                </div>
              )}

              <Textarea
                placeholder="What are your thoughts?"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[80px] resize-none bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 focus:border-orange-300 dark:focus:border-orange-600"
              />

              <Button
                onClick={handleCommentSubmit}
                disabled={isSubmitting || !commentText.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => {
                // Get initials for avatar
                const commentorName = comment.userName || "Anonymous";
                const initials = commentorName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2);

                // Format timestamp
                const timeAgo = (() => {
                  const now = new Date();
                  const commentDate = new Date(comment.createdAt);
                  const seconds = Math.floor(
                    (now.getTime() - commentDate.getTime()) / 1000
                  );

                  if (seconds < 60) return `${seconds}s ago`;
                  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
                  if (seconds < 86400)
                    return `${Math.floor(seconds / 3600)}h ago`;
                  if (seconds < 604800)
                    return `${Math.floor(seconds / 86400)}d ago`;

                  return commentDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year:
                      commentDate.getFullYear() !== now.getFullYear()
                        ? "numeric"
                        : undefined,
                  });
                })();

                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(0.6 + index * 0.1, 1),
                    }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-sm font-medium text-white">
                        {initials}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {commentorName}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {timeAgo}
                        </span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {comment.commentText}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
