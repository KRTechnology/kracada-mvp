"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, X, ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { TiptapEditor } from "./TiptapEditor";
import {
  uploadLifestyleFeaturedImage,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
import {
  updateLifestylePostAction,
  deleteLifestylePostAction,
  generateUniqueSlugAction,
} from "@/app/actions/lifestyle-actions";

const updatePostFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  slug: z.string().min(1, "Slug is required").max(550, "Slug is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

type UpdatePostFormData = z.infer<typeof updatePostFormSchema>;

interface EditLifestylePostFormProps {
  userId: string;
  authorName: string;
  post: any;
}

const PREDEFINED_CATEGORIES = [
  "Personal Development",
  "Health",
  "Wellness",
  "Fitness",
  "Nutrition",
  "Mental Health",
  "Fashion",
  "Sustainability",
  "Work-Life Balance",
  "Career",
  "Productivity",
  "Mindfulness",
  "Finance",
  "Home",
  "Relationships",
  "Communication",
  "Culture",
  "Lifestyle",
  "Self-Care",
  "Minimalism",
];

export function EditLifestylePostForm({
  userId,
  authorName,
  post,
}: EditLifestylePostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editorContent, setEditorContent] = useState(post.content || "");
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    post.featuredImage || null,
  );
  const [featuredImageKey, setFeaturedImageKey] = useState<string | null>(
    post.featuredImageKey || null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post.categories || [],
  );
  const [customCategory, setCustomCategory] = useState("");
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdatePostFormData>({
    resolver: zodResolver(updatePostFormSchema),
    defaultValues: {
      title: post.title || "",
      slug: post.slug || "",
      description: post.description || "",
      status: post.status || "published",
    },
  });

  const watchTitle = watch("title");
  const watchStatus = watch("status");

  // Generate slug from title
  const handleGenerateSlug = async () => {
    if (!watchTitle || watchTitle.trim().length === 0) {
      toast.error("Please enter a title first");
      return;
    }

    setIsGeneratingSlug(true);
    try {
      const result = await generateUniqueSlugAction(watchTitle);
      if (result.success && result.slug) {
        setValue("slug", result.slug);
        toast.success("Slug generated successfully");
      } else {
        toast.error(result.message || "Failed to generate slug");
      }
    } catch (error) {
      console.error("Slug generation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      e.target.value = "";
      return;
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size exceeds 5MB limit");
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("postTitle", watchTitle || "untitled");

      const result = await uploadLifestyleFeaturedImage(formData);

      if (result.success && result.url) {
        // Delete old image if exists
        if (featuredImageKey) {
          try {
            await deleteUploadedFile(featuredImageKey);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        setFeaturedImage(result.url);
        setFeaturedImageKey(result.key || null);
        toast.success("Featured image updated successfully");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during upload";
      toast.error(errorMessage);
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Remove featured image
  const handleRemoveFeaturedImage = async () => {
    if (featuredImageKey) {
      try {
        await deleteUploadedFile(featuredImageKey);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    setFeaturedImage(null);
    setFeaturedImageKey(null);
  };

  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // Add custom category
  const handleAddCustomCategory = () => {
    if (
      customCategory.trim() &&
      !selectedCategories.includes(customCategory.trim())
    ) {
      setSelectedCategories((prev) => [...prev, customCategory.trim()]);
      setCustomCategory("");
    }
  };

  // Remove category
  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  // Submit form
  const onSubmit = async (data: UpdatePostFormData) => {
    if (!editorContent || editorContent.trim().length === 0) {
      toast.error("Please write some content for your post");
      return;
    }

    if (!featuredImage) {
      toast.error("Please upload a featured image");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateLifestylePostAction({
          id: post.id,
          title: data.title,
          slug: data.slug,
          description: data.description || undefined,
          content: editorContent,
          featuredImage,
          featuredImageKey: featuredImageKey || undefined,
          categories:
            selectedCategories.length > 0 ? selectedCategories : undefined,
          status: data.status,
        });

        if (result.success) {
          toast.success(result.message);
          router.push(`/lifestyle/${post.id}`);
        } else {
          toast.error(result.message || "Failed to update post");
        }
      } catch (error) {
        console.error("Update post error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while updating post";
        toast.error(errorMessage);
      }
    });
  };

  // Delete post
  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteLifestylePostAction(post.id);

      if (result.success) {
        toast.success(result.message);
        router.push("/lifestyle");
      } else {
        toast.error(result.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting post";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Edit Lifestyle Post
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Update your post content and settings
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={handleDeletePost}
            disabled={isDeleting || isPending}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Label className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 block">
            Featured Image *
          </Label>

          {featuredImage ? (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden group">
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label htmlFor="featured-image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white text-neutral-900"
                    disabled={isUploadingImage}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <input
                    id="featured-image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFeaturedImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemoveFeaturedImage}
                  disabled={isUploadingImage}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
              {isUploadingImage ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Uploading image...
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">
                    JPEG, PNG, WebP, or GIF (Max: 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFeaturedImageUpload}
                    className="hidden"
                    id="featured-image-upload-empty"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document
                        .getElementById("featured-image-upload-empty")
                        ?.click()
                    }
                  >
                    Select Image
                  </Button>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Label htmlFor="title" className="text-lg font-semibold">
            Title *
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter an engaging title for your post"
            className="mt-2 text-lg"
            disabled={isPending}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </motion.div>

        {/* Slug */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Label htmlFor="slug" className="text-lg font-semibold">
            URL Slug *
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="slug"
              {...register("slug")}
              placeholder="url-friendly-slug"
              className="flex-1"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateSlug}
              disabled={isPending || isGeneratingSlug || !watchTitle}
            >
              {isGeneratingSlug ? "Generating..." : "Regenerate"}
            </Button>
          </div>
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Label htmlFor="description" className="text-lg font-semibold">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="A brief description of your post (shown in listings)"
            className="mt-2"
            rows={3}
            disabled={isPending}
          />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Label className="text-lg font-semibold mb-4 block">
            Categories (Optional)
          </Label>

          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full flex items-center gap-2"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Predefined Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PREDEFINED_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedCategories.includes(category)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Custom Category Input */}
          <div className="flex gap-2">
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Add a custom category"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomCategory}
              disabled={!customCategory.trim()}
            >
              Add
            </Button>
          </div>
        </motion.div>

        {/* Content Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Label className="text-lg font-semibold mb-4 block">Content *</Label>
          <TiptapEditor
            content={editorContent}
            onChange={setEditorContent}
            userId={userId}
            postId={post.id}
            placeholder="Start writing your post..."
          />
        </motion.div>

        {/* Status Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-4"
        >
          <Label className="text-lg font-semibold">Status:</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("status")}
                value="published"
                className="w-4 h-4"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Published
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("status")}
                value="draft"
                className="w-4 h-4"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Draft
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("status")}
                value="archived"
                className="w-4 h-4"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Archived
              </span>
            </label>
          </div>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-4"
        >
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isPending || isUploadingImage || isDeleting}
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending || isDeleting}
          >
            Cancel
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
