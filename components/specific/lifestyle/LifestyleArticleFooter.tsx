"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

export const LifestyleArticleFooter = () => {
  const [liked, setLiked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const comments = [
    {
      id: 1,
      author: "Tamar Amar",
      time: "5 min ago",
      avatar: "TA",
      text: "Sit accumsan vel lacus faucibus volutpat cum. Fringilla tincidunt bibendum interdum morbi volutpat sed maecenas egestas semper.",
    },
    {
      id: 2,
      author: "Jayden Green",
      time: "5 min ago",
      avatar: "JG",
      text: "Sit accumsan vel lacus faucibus volutpat cum. Fringilla tincidunt bibendum interdum morbi volutpat sed maecenas egestas semper.",
    },
    {
      id: 3,
      author: "Ayhan Seven",
      time: "5 min ago",
      avatar: "AS",
      text: "Sit accumsan vel lacus faucibus volutpat cum. Fringilla tincidunt bibendum interdum morbi volutpat sed maecenas egestas semper.",
    },
    {
      id: 4,
      author: "Shamika Thompson",
      time: "5 min ago",
      avatar: "ST",
      text: "Sit accumsan vel lacus faucibus volutpat cum. Fringilla tincidunt bibendum interdum morbi volutpat sed maecenas egestas semper.",
    },
  ];

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
            Comments (30)
          </h3>

          {/* Current User Comment Input */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                AA
              </span>
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <span className="font-medium text-neutral-900 dark:text-white">
                  Asma'u Aliyu
                </span>
              </div>
              <Textarea
                placeholder="What are your thoughts?"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[80px] resize-none bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 focus:border-orange-300 dark:focus:border-orange-600"
              />
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-sm font-medium text-white">
                    {comment.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
