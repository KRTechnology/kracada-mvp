"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, X, ArrowLeft, Save, FileText } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { NewsTiptapEditor } from "./NewsTiptapEditor";
import {
  uploadNewsFeaturedImage,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
import {
  createNewsPostAction,
  generateUniqueNewsSlugAction,
} from "@/app/(dashboard)/actions/news-actions";
import Image from "next/image";

const createNewsFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  slug: z.string().min(1, "Slug is required").max(550, "Slug is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
  categories: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

type CreateNewsFormData = z.infer<typeof createNewsFormSchema>;

interface CreateNewsPostFormProps {
  adminId: string;
  adminName: string;
}

const PREDEFINED_NEWS_CATEGORIES = [
  "Leadership",
  "Management",
  "Product",
  "Research",
  "Frameworks",
  "Technology",
  "Business",
  "Design",
  "Marketing",
  "Finance",
  "Startups",
  "Innovation",
  "Strategy",
  "Culture",
  "Career",
  "Development",
  "Analytics",
  "Customer Success",
  "SaaS",
  "Operations",
];

export function CreateNewsPostForm({
  adminId,
  adminName,
}: CreateNewsPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editorContent, setEditorContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageKey, setFeaturedImageKey] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateNewsFormData>({
    resolver: zodResolver(createNewsFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categories: "",
      status: "published",
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
      const result = await generateUniqueNewsSlugAction(watchTitle);
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
    e: React.ChangeEvent<HTMLInputElement>
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
      formData.append("adminId", adminId);
      formData.append("postTitle", watchTitle || "untitled");

      const result = await uploadNewsFeaturedImage(formData);

      if (result.success && result.url) {
        setFeaturedImage(result.url);
        setFeaturedImageKey(result.key || null);
        toast.success("Featured image uploaded successfully");
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
        : [...prev, category]
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
  const onSubmit = async (data: CreateNewsFormData) => {
    if (!editorContent || editorContent.trim().length === 0) {
      toast.error("Please write some content for your news post");
      return;
    }

    if (!featuredImage) {
      toast.error("Please upload a featured image");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createNewsPostAction({
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

        if (result.success && result.data) {
          toast.success(result.message);
          router.push(`/admin/dashboard/news`);
        } else {
          toast.error(result.message || "Failed to create news post");
        }
      } catch (error) {
        console.error("Create news post error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while creating post";
        toast.error(errorMessage);
      }
    });
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
          onClick={() => router.push("/admin/dashboard/news")}
          className="mb-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News Management
        </Button>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Create News Post
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Write and publish news articles for the community
        </p>
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
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <Image
                src={featuredImage}
                alt="Featured image"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveFeaturedImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center hover:border-warm-500 dark:hover:border-warm-500 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                {isUploadingImage
                  ? "Uploading..."
                  : "Click to upload featured image"}
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                disabled={isUploadingImage}
                className="max-w-xs mx-auto"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Recommended: 1200x630px (Max 5MB)
              </p>
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
            placeholder="Enter news title"
            className="mt-2"
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
            Slug *
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="slug"
              {...register("slug")}
              placeholder="news-post-url-slug"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleGenerateSlug}
              disabled={isGeneratingSlug || !watchTitle}
              variant="outline"
            >
              {isGeneratingSlug ? "Generating..." : "Generate"}
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
            placeholder="Brief description or excerpt (shown in listings)"
            className="mt-2"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Label className="text-lg font-semibold mb-4 block">Categories</Label>

          {/* Selected categories */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 rounded-full text-sm"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-warm-600 dark:text-warm-400 hover:text-warm-800 dark:hover:text-warm-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Predefined categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            {PREDEFINED_NEWS_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  selectedCategories.includes(category)
                    ? "bg-warm-500 text-white border-warm-500"
                    : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:border-warm-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Custom category input */}
          <div className="flex gap-2">
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Add custom category"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddCustomCategory}
              variant="outline"
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
          <NewsTiptapEditor
            content={editorContent}
            onChange={setEditorContent}
            adminId={adminId}
            placeholder="Write your news post content here..."
          />
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-4"
        >
          <Label className="text-lg font-semibold">Status</Label>
          <select
            {...register("status")}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/dashboard/news")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || isUploadingImage}
            className="bg-warm-600 hover:bg-warm-700 text-white"
          >
            {isPending ? (
              <>
                <FileText className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {watchStatus === "draft"
                  ? "Save as Draft"
                  : "Publish News Post"}
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
