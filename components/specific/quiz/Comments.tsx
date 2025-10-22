"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
  isOnline?: boolean;
}

interface CommentsProps {
  quizId: string | number;
}

export function Comments({ quizId }: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Phoenix Baker",
      avatar: "/images/landing-hero-image.jpg",
      timestamp: "Just now",
      text: "Looks good!",
      isOnline: true,
    },
    {
      id: "2",
      author: "Lana Steiner",
      avatar: "/images/landing-hero-image.jpg",
      timestamp: "2 mins ago",
      text: "Thanks so much, happy with that.",
      isOnline: false,
    },
    {
      id: "3",
      author: "Lana Steiner",
      avatar: "/images/landing-hero-image.jpg",
      timestamp: "2 mins ago",
      text: "Thanks so much, happy with that.",
      isOnline: false,
    },
    {
      id: "4",
      author: "Lana Steiner",
      avatar: "/images/landing-hero-image.jpg",
      timestamp: "2 mins ago",
      text: "Thanks so much, happy with that.",
      isOnline: false,
    },
  ]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "/images/landing-hero-image.jpg",
      timestamp: "Just now",
      text: newComment,
      isOnline: true,
    };

    setComments([comment, ...comments]);
    setNewComment("");
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
          />
          <Button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Add Comment
          </Button>
        </div>
      </form>

      {/* Comments List */}
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
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {comment.author.charAt(0)}
                </span>
              </div>
              {/* Online Status Indicator */}
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-800 ${
                  comment.isOnline ? "bg-green-500" : "bg-neutral-400"
                }`}
              />
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {comment.author}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {comment.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
