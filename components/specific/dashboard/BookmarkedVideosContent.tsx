"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, ExternalLink, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/common/button";
import { format } from "date-fns";
import {
  removeBookmarkAction,
  BookmarkedVideoItem,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import { Spinner } from "@/components/common/spinner";

interface BookmarkedVideosContentProps {
  bookmarkedVideos: BookmarkedVideoItem[];
}

export function BookmarkedVideosContent({
  bookmarkedVideos: initialVideos,
}: BookmarkedVideosContentProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] =
    useState<BookmarkedVideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveBookmark = (video: BookmarkedVideoItem) => {
    setVideoToDelete(video);
    setIsDeleteModalOpen(true);
  };

  const confirmRemoveBookmark = async () => {
    if (!videoToDelete) return;

    setIsDeleting(true);
    const result = await removeBookmarkAction("video", videoToDelete.id);

    if (result.success) {
      setVideos(videos.filter((v) => v.id !== videoToDelete.id));
      toast.success("Video removed from bookmarks");
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
    } else {
      toast.error(result.message || "Failed to remove bookmark");
    }
    setIsDeleting(false);
  };

  const handleWatchVideo = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Bookmarked Videos
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {videos.length} {videos.length === 1 ? "video" : "videos"} saved for
          later
        </p>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm p-12 text-center"
        >
          <VideoIcon className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            No bookmarked videos yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Start bookmarking videos from the entertainment section to watch
            them later
          </p>
          <Button
            onClick={() => (window.location.href = "/entertainment")}
            className="bg-warm-600 hover:bg-warm-700 text-white"
          >
            Explore Videos
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Thumbnail */}
              <div
                className="relative aspect-video overflow-hidden cursor-pointer group"
                onClick={() => handleWatchVideo(video.videoUrl)}
              >
                <img
                  src={video.thumbnailImage}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play
                      className="w-6 h-6 text-neutral-800 ml-1"
                      fill="currentColor"
                    />
                  </motion.div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                  {video.duration}
                </div>

                {/* External Link Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    {video.author}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    •
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {format(new Date(video.bookmarkedAt), "MMM d, yyyy")}
                  </span>
                </div>

                <h3
                  className="text-base font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  onClick={() => handleWatchVideo(video.videoUrl)}
                >
                  {video.title}
                </h3>

                {video.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                )}

                {/* Categories */}
                {video.categories && video.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {video.categories.slice(0, 2).map((category, idx) => {
                      const colors = [
                        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                      ];
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${colors[idx % colors.length]}`}
                        >
                          {category}
                        </span>
                      );
                    })}
                    {video.categories.length > 2 && (
                      <span className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        +{video.categories.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {video.viewCount}
                    </span>
                    <span>❤️ {video.likeCount}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBookmark(video)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Bookmark</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{videoToDelete?.title}" from your
              bookmarks?
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
              onClick={confirmRemoveBookmark}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
