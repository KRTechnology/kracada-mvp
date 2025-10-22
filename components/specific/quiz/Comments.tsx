"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  getQuizCommentsAction,
  addQuizCommentAction,
  deleteQuizCommentAction,
} from "@/app/(dashboard)/actions/quiz-actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  quizId: string;
  userId: string | null;
  userName: string | null;
  userAvatar: string | null;
  commentText: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CommentsProps {
  quizId: string | number;
}

export function Comments({ quizId }: CommentsProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [quizId]);

  const fetchComments = async () => {
    setIsLoading(true);
    const result = await getQuizCommentsAction(quizId.toString());
    if (result.success && result.data) {
      setComments(result.data as Comment[]);
    }
    setIsLoading(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const result = await addQuizCommentAction({
      quizId: quizId.toString(),
      commentText: newComment.trim(),
      userName: session?.user?.name || undefined,
    });

    if (result.success) {
      toast.success("Comment added successfully");
      setNewComment("");
      await fetchComments(); // Refresh comments
    } else {
      toast.error(result.message || "Failed to add comment");
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);

    const result = await deleteQuizCommentAction(commentId);

    if (result.success) {
      toast.success("Comment deleted successfully");
      await fetchComments(); // Refresh comments
    } else {
      toast.error(result.message || "Failed to delete comment");
    }

    setDeletingCommentId(null);
  };

  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      {/* Comments Header */}
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
          Comments
        </h3>
        <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-sm px-2 py-1 rounded-full">
          {comments.length}
        </span>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Comment"
            )}
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      ) : comments.length === 0 ? (
        /* Empty State */
        <div className="text-center py-8">
          <p className="text-neutral-600 dark:text-neutral-400">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        /* Comments List */
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {(comment.userName || "A").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {comment.userName || "Anonymous"}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {/* Delete button - only show for comment owner */}
                  {session?.user?.id === comment.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deletingCommentId === comment.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 px-2"
                    >
                      {deletingCommentId === comment.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {comment.commentText}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
