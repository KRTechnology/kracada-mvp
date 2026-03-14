"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import {
  getVideoByIdAction,
  updateVideoAction,
} from "@/app/(dashboard)/actions/video-actions";
import { uploadVideoThumbnail } from "@/app/(dashboard)/actions/upload-actions";
import { useSession } from "next-auth/react";

// Video categories
const VIDEO_CATEGORIES = [
  "Product Management",
  "Strategy",
  "Design",
  "UX/UI",
  "Programming",
  "Web Development",
  "Leadership",
  "Remote Work",
  "AI/ML",
  "Data Science",
  "Project Management",
  "Agile",
  "Cloud Computing",
  "Architecture",
  "Marketing",
  "Content Strategy",
  "Security",
  "Best Practices",
  "Visualization",
  "Mobile Development",
  "Technology Trends",
  "Startup",
  "Funding",
  "E-commerce",
  "Growth",
  "Blockchain",
  "Productivity",
  "Personal Development",
  "API Development",
  "Software Architecture",
  "DevOps",
  "Culture",
  "User Research",
  "UX Design",
];

// Form schema
const updateVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  description: z.string().optional(),
  videoUrl: z.string().url("Please enter a valid video URL"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d{1,2}:\d{2}$/, "Duration must be in format MM:SS or M:SS"),
  type: z.enum(["kracada_tv", "trending"], {
    required_error: "Please select a video type",
  }),
  categories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(5, "Maximum 5 categories allowed"),
  author: z.string().min(1, "Author name is required"),
  status: z.enum(["draft", "published", "hidden"], {
    required_error: "Please select a status",
  }),
});

type FormData = z.infer<typeof updateVideoSchema>;

interface EditVideoContentProps {
  videoId: string;
}

export default function EditVideoContent({ videoId }: EditVideoContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailKey, setThumbnailKey] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updateVideoSchema),
  });

  const watchType = watch("type");
  const watchStatus = watch("status");

  // Fetch existing video data
  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      const result = await getVideoByIdAction(videoId);

      if (result.success && result.data) {
        const video = result.data;
        const categories = JSON.parse(video.categories || "[]");

        reset({
          title: video.title,
          description: video.description || "",
          videoUrl: video.videoUrl,
          duration: video.duration,
          type: video.type,
          categories,
          author: video.author,
          status: video.status,
        });

        setThumbnailUrl(video.thumbnailImage);
        setSelectedCategories(categories);
      } else {
        toast.error("Failed to load video");
        router.push("/admin/dashboard/videos");
      }
      setIsLoading(false);
    };

    fetchVideo();
  }, [videoId, reset, router]);

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size exceeds 5MB limit.");
      event.target.value = "";
      return;
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a valid image.");
      event.target.value = "";
      return;
    }

    setIsUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("adminId", session?.user?.id || "");
      formData.append("videoTitle", watch("title") || "untitled");

      const result = await uploadVideoThumbnail(formData);

      if (result.success && result.url) {
        setThumbnailUrl(result.url);
        setThumbnailKey(result.key || null);
        toast.success("Thumbnail uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploadingThumbnail(false);
    }

    event.target.value = "";
  };

  const handleRemoveThumbnail = () => {
    setThumbnailUrl(null);
    setThumbnailKey(null);
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    if (newCategories.length > 5) {
      toast.error("Maximum 5 categories allowed");
      return;
    }

    setSelectedCategories(newCategories);
    setValue("categories", newCategories, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    if (!thumbnailUrl) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateVideoAction({
          id: videoId,
          ...data,
          thumbnailImage: thumbnailUrl,
        });

        if (result.success) {
          toast.success("Video updated successfully!");
          router.push("/admin/dashboard/videos");
        } else {
          toast.error(result.message || "Failed to update video");
        }
      } catch (error) {
        console.error("Update video error:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/videos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Button>
        </Link>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Video</h1>
          <p className="text-warm-50 text-lg">
            Update video details and settings
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Video Details
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="required">
                Video Title
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter video title"
                className="mt-2"
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter video description"
                rows={4}
                className="mt-2"
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Video URL */}
            <div>
              <Label htmlFor="videoUrl" className="required">
                Video URL
              </Label>
              <Input
                id="videoUrl"
                {...register("videoUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-2"
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.videoUrl.message}
                </p>
              )}
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                YouTube, Vimeo, or any video URL
              </p>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label className="required">Video Thumbnail</Label>
              <div className="mt-2">
                {thumbnailUrl ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <label
                      htmlFor="thumbnail-upload"
                      className="absolute bottom-2 right-2"
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="bg-white"
                        disabled={isUploadingThumbnail}
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                      >
                        {isUploadingThumbnail ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Change
                          </>
                        )}
                      </Button>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={isUploadingThumbnail}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Upload a thumbnail image for your video
                    </p>
                    <label htmlFor="thumbnail-upload">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploadingThumbnail}
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                      >
                        {isUploadingThumbnail ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </>
                        )}
                      </Button>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={isUploadingThumbnail}
                      />
                    </label>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      Max size: 5MB. Formats: JPEG, PNG, WebP, GIF
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration" className="required">
                Duration
              </Label>
              <Input
                id="duration"
                {...register("duration")}
                placeholder="12:34"
                className="mt-2"
              />
              {errors.duration && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.duration.message}
                </p>
              )}
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Format: MM:SS (e.g., 12:34)
              </p>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author" className="required">
                Author Name
              </Label>
              <Input
                id="author"
                {...register("author")}
                placeholder="e.g., Demi Wilkinson"
                className="mt-2"
              />
              {errors.author && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type" className="required">
                Video Type
              </Label>
              <Select
                value={watchType}
                onValueChange={(value) => setValue("type", value as any)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select video type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kracada_tv">Kracada TV</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Categories */}
            <div>
              <Label className="required">Categories (Select up to 5)</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {VIDEO_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      selectedCategories.includes(category)
                        ? "bg-warm-500 border-warm-500 text-white"
                        : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-warm-500"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {errors.categories.message}
                </p>
              )}
              {selectedCategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 text-sm rounded-full flex items-center gap-2"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="hover:text-warm-900 dark:hover:text-warm-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" className="required">
                Status
              </Label>
              <Select
                value={watchStatus}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/dashboard/videos">
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isPending || !thumbnailUrl}
            className="bg-warm-600 hover:bg-warm-700"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Video"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
