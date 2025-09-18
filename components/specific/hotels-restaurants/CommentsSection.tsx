"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Star, ThumbsUp, Flag, Reply } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import Image from "next/image";

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  date: string;
  content: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentsSectionProps {
  itemId: string;
  itemType: "hotel" | "restaurant";
}

// Sample comments data - in real app, this would come from API
const sampleComments: Comment[] = [
  {
    id: 1,
    author: {
      name: "Adebayo Johnson",
      avatar: "/images/contributor-profile-image.png",
      verified: true,
    },
    rating: 5,
    date: "2 days ago",
    content: "Absolutely amazing experience! The service was impeccable and the location is stunning. The staff went above and beyond to make our stay memorable. The rooftop views are breathtaking, especially during sunset. Highly recommend this place for special occasions.",
    likes: 24,
    isLiked: false,
  },
  {
    id: 2,
    author: {
      name: "Chioma Okeke",
      avatar: "/images/contributor-profile-image.png",
      verified: false,
    },
    rating: 4,
    date: "1 week ago",
    content: "Great ambiance and excellent food quality. The presentation was beautiful and the flavors were well-balanced. The only minor issue was the wait time, but the staff kept us informed throughout. Overall, a wonderful dining experience that I'd definitely repeat.",
    likes: 18,
    isLiked: true,
  },
  {
    id: 3,
    author: {
      name: "Michael Thompson",
      avatar: "/images/contributor-profile-image.png",
      verified: true,
    },
    rating: 5,
    date: "2 weeks ago",
    content: "Outstanding service and attention to detail. Every aspect of our visit exceeded expectations. The menu is creative and the wine selection is impressive. Perfect for business dinners or romantic occasions. Will definitely be back soon!",
    likes: 31,
    isLiked: false,
  },
  {
    id: 4,
    author: {
      name: "Fatima Abdullahi",
      avatar: "/images/contributor-profile-image.png",
      verified: false,
    },
    rating: 4,
    date: "3 weeks ago",
    content: "Lovely atmosphere and friendly staff. The food was delicious, though some dishes were a bit pricey. The location is convenient and the interior design is beautiful. Great for celebrations and special events.",
    likes: 12,
    isLiked: false,
  },
  {
    id: 5,
    author: {
      name: "David Okafor",
      avatar: "/images/contributor-profile-image.png",
      verified: true,
    },
    rating: 5,
    date: "1 month ago",
    content: "Exceptional quality across the board. From the moment we arrived until we left, everything was perfect. The attention to detail in both service and presentation is remarkable. This place sets the standard for fine dining in Lagos.",
    likes: 28,
    isLiked: true,
  },
  {
    id: 6,
    author: {
      name: "Sarah Williams",
      avatar: "/images/contributor-profile-image.png",
      verified: false,
    },
    rating: 4,
    date: "1 month ago",
    content: "Really enjoyed our visit here. The ambiance is sophisticated and the staff is professional. Food quality is consistently good and the portion sizes are generous. A few minor issues with timing but nothing major.",
    likes: 15,
    isLiked: false,
  },
  {
    id: 7,
    author: {
      name: "Ibrahim Musa",
      avatar: "/images/contributor-profile-image.png",
      verified: true,
    },
    rating: 5,
    date: "2 months ago",
    content: "World-class establishment with impeccable standards. The culinary team clearly knows what they're doing. Every dish was a masterpiece. The service timing was perfect and the staff was knowledgeable about the menu and wine pairings.",
    likes: 22,
    isLiked: false,
  },
  {
    id: 8,
    author: {
      name: "Grace Adeola",
      avatar: "/images/contributor-profile-image.png",
      verified: false,
    },
    rating: 4,
    date: "2 months ago",
    content: "Beautiful setting and great food. The view is incredible and the atmosphere is perfect for date nights. Service was attentive without being intrusive. Prices are on the higher side but worth it for special occasions.",
    likes: 19,
    isLiked: true,
  },
];

export const CommentsSection = ({ itemId, itemType }: CommentsSectionProps) => {
  const [comments] = useState<Comment[]>(sampleComments);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const commentsPerPage = 5;

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const currentComments = comments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLike = (commentId: number) => {
    // In real app, this would update the like status via API
    console.log(`Liked comment ${commentId}`);
  };

  const handleSubmitComment = () => {
    // In real app, this would submit the comment via API
    console.log("Submitting comment:", { content: newComment, rating: newRating });
    setNewComment("");
    setNewRating(5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        Reviews & Comments ({comments.length})
      </h2>

      {/* Add Comment Form */}
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Leave a review
        </h3>
        
        {/* Rating Input */}
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
          disabled={!newComment.trim()}
          className="bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          Post Review
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-6 mb-8">
        {currentComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {comment.author.name}
                    </h4>
                    {comment.author.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < comment.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300 dark:text-neutral-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {comment.date}
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
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  comment.isLiked
                    ? "bg-warm-100 dark:bg-warm-900/20 text-warm-200"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">{comment.likes}</span>
              </button>
              
              <button className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-warm-200 dark:hover:text-warm-200 transition-colors">
                <Reply className="w-4 h-4" />
                <span className="text-sm font-medium">Reply</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};
