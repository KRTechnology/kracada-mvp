// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "sonner";
// import { Upload, X, ArrowLeft, Eye, Save } from "lucide-react";
// import { Button } from "@/components/common/button";
// import { Input } from "@/components/common/input";
// import { Label } from "@/components/common/label";
// import { Textarea } from "@/components/common/textarea";
// import {
//   uploadLifestyleFeaturedImage,
//   deleteUploadedFile,
// } from "@/app/(dashboard)/actions/upload-actions";
// import {
//   createLifestylePostAction,
//   generateUniqueSlugAction,
// } from "@/app/actions/lifestyle-actions";
// import { TiptapEditor } from "../lifestyle/TiptapEditor";

// const createPostFormSchema = z.object({
//   title: z.string().min(1, "Title is required").max(500, "Title is too long"),
//   slug: z.string().min(1, "Slug is required").max(550, "Slug is too long"),
//   description: z
//     .string()
//     .max(500, "Description is too long")
//     .optional()
//     .or(z.literal("")),
//   categories: z.string().optional().or(z.literal("")),
//   status: z.enum(["draft", "published"]),
// });

// type CreatePostFormData = z.infer<typeof createPostFormSchema>;

// interface CreateLifestylePostFormProps {
//   userId: string;
//   authorName: string;
// }

// const PREDEFINED_CATEGORIES = [
//   "Personal Development",
//   "Health",
//   "Wellness",
//   "Fitness",
//   "Nutrition",
//   "Mental Health",
//   "Fashion",
//   "Sustainability",
//   "Work-Life Balance",
//   "Career",
//   "Productivity",
//   "Mindfulness",
//   "Finance",
//   "Home",
//   "Relationships",
//   "Communication",
//   "Culture",
//   "Lifestyle",
//   "Self-Care",
//   "Minimalism",
// ];

// export function ContactUsForm({}: CreateLifestylePostFormProps) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [editorContent, setEditorContent] = useState("");
//   const [featuredImage, setFeaturedImage] = useState<string | null>(null);
//   const [featuredImageKey, setFeaturedImageKey] = useState<string | null>(null);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [customCategory, setCustomCategory] = useState("");
//   const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<CreatePostFormData>({
//     resolver: zodResolver(createPostFormSchema),
//     defaultValues: {
//       title: "",
//       slug: "",
//       description: "",
//       categories: "",
//       status: "published",
//     },
//   });

//   const watchTitle = watch("title");
//   const watchStatus = watch("status");

//   // Generate slug from title
//   const handleGenerateSlug = async () => {
//     if (!watchTitle || watchTitle.trim().length === 0) {
//       toast.error("Please enter a title first");
//       return;
//     }

//     setIsGeneratingSlug(true);
//     try {
//       const result = await generateUniqueSlugAction(watchTitle);
//       if (result.success && result.slug) {
//         setValue("slug", result.slug);
//         toast.success("Slug generated successfully");
//       } else {
//         toast.error(result.message || "Failed to generate slug");
//       }
//     } catch (error) {
//       console.error("Slug generation error:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "An unexpected error occurred";
//       toast.error(errorMessage);
//     } finally {
//       setIsGeneratingSlug(false);
//     }
//   };

//   // Handle featured image upload
//   const handleFeaturedImageUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//       "image/gif",
//     ];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
//       e.target.value = "";
//       return;
//     }

//     // Validate file size (5MB limit)
//     const MAX_SIZE = 5 * 1024 * 1024;
//     if (file.size > MAX_SIZE) {
//       toast.error("Image size exceeds 5MB limit");
//       e.target.value = "";
//       return;
//     }

//     setIsUploadingImage(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("postTitle", watchTitle || "untitled");

//       const result = await uploadLifestyleFeaturedImage(formData);

//       if (result.success && result.url) {
//         setFeaturedImage(result.url);
//         setFeaturedImageKey(result.key || null);
//         toast.success("Featured image uploaded successfully");
//       } else {
//         toast.error(result.error || "Failed to upload image");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred during upload";
//       toast.error(errorMessage);
//     } finally {
//       setIsUploadingImage(false);
//       e.target.value = "";
//     }
//   };

//   // Remove featured image
//   const handleRemoveFeaturedImage = async () => {
//     if (featuredImageKey) {
//       try {
//         await deleteUploadedFile(featuredImageKey);
//       } catch (error) {
//         console.error("Error deleting image:", error);
//       }
//     }
//     setFeaturedImage(null);
//     setFeaturedImageKey(null);
//   };

//   // Handle category selection
//   const toggleCategory = (category: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category)
//         ? prev.filter((c) => c !== category)
//         : [...prev, category]
//     );
//   };

//   // Add custom category
//   const handleAddCustomCategory = () => {
//     if (
//       customCategory.trim() &&
//       !selectedCategories.includes(customCategory.trim())
//     ) {
//       setSelectedCategories((prev) => [...prev, customCategory.trim()]);
//       setCustomCategory("");
//     }
//   };

//   // Remove category
//   const removeCategory = (category: string) => {
//     setSelectedCategories((prev) => prev.filter((c) => c !== category));
//   };

//   // Submit form
//   const onSubmit = async (data: CreatePostFormData) => {
//     if (!editorContent || editorContent.trim().length === 0) {
//       toast.error("Please write some content for your post");
//       return;
//     }

//     if (!featuredImage) {
//       toast.error("Please upload a featured image");
//       return;
//     }

//     startTransition(async () => {
//       try {
//         const result = await createLifestylePostAction({
//           title: data.title,
//           slug: data.slug,
//           description: data.description || undefined,
//           content: editorContent,
//           featuredImage,
//           featuredImageKey: featuredImageKey || undefined,
//           categories:
//             selectedCategories.length > 0 ? selectedCategories : undefined,
//           status: data.status,
//         });

//         if (result.success && result.data) {
//           toast.success(result.message);
//           router.push(`/lifestyle/${result.data.id}`);
//         } else {
//           toast.error(result.message || "Failed to create post");
//         }
//       } catch (error) {
//         console.error("Create post error:", error);
//         const errorMessage =
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred while creating post";
//         toast.error(errorMessage);
//       }
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-5xl">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="mb-8"
//       >
//         <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
//           Create a Lifestyle Post
//         </h1>
//         <p className="text-neutral-600 dark:text-neutral-400">
//           Share your insights and stories with the community
//         </p>
//       </motion.div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         {/* Featured Image */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//         >
//           <Label className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 block">
//             Featured Image *
//           </Label>

//           {featuredImage ? (
//             <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden group">
//               <img
//                 src={featuredImage}
//                 alt="Featured"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleRemoveFeaturedImage}
//                   disabled={isUploadingImage}
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Remove Image
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
//               {isUploadingImage ? (
//                 <div className="flex flex-col items-center space-y-2">
//                   <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
//                   <p className="text-sm text-neutral-600 dark:text-neutral-400">
//                     Uploading image...
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
//                   <p className="text-neutral-600 dark:text-neutral-400 mb-2">
//                     Click to upload or drag and drop
//                   </p>
//                   <p className="text-sm text-neutral-500 dark:text-neutral-500">
//                     JPEG, PNG, WebP, or GIF (Max: 5MB)
//                   </p>
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
//                     onChange={handleFeaturedImageUpload}
//                     className="hidden"
//                     id="featured-image-upload"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="mt-4"
//                     onClick={() =>
//                       document.getElementById("featured-image-upload")?.click()
//                     }
//                   >
//                     Select Image
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
//         </motion.div>

//         {/* Title */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//         >
//           <Label htmlFor="title" className="text-lg font-semibold">
//             Title *
//           </Label>
//           <Input
//             id="title"
//             {...register("title")}
//             placeholder="Enter an engaging title for your post"
//             className="mt-2 text-lg"
//             disabled={isPending}
//           />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//           )}
//         </motion.div>

//         {/* Slug */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//         >
//           <Label htmlFor="slug" className="text-lg font-semibold">
//             URL Slug *
//           </Label>
//           <div className="flex gap-2 mt-2">
//             <Input
//               id="slug"
//               {...register("slug")}
//               placeholder="url-friendly-slug"
//               className="flex-1"
//               disabled={isPending}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleGenerateSlug}
//               disabled={isPending || isGeneratingSlug || !watchTitle}
//             >
//               {isGeneratingSlug ? "Generating..." : "Generate"}
//             </Button>
//           </div>
//           {errors.slug && (
//             <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
//           )}
//           <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
//             This will be used in the post URL. Use lowercase letters, numbers,
//             and hyphens only.
//           </p>
//         </motion.div>

//         {/* Description */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           <Label htmlFor="description" className="text-lg font-semibold">
//             Description (Optional)
//           </Label>
//           <Textarea
//             id="description"
//             {...register("description")}
//             placeholder="A brief description of your post (shown in listings)"
//             className="mt-2"
//             rows={3}
//             disabled={isPending}
//           />
//           {errors.description && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.description.message}
//             </p>
//           )}
//         </motion.div>

//         {/* Categories */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.5 }}
//         >
//           <Label className="text-lg font-semibold mb-4 block">
//             Categories (Optional)
//           </Label>

//           {/* Selected Categories */}
//           {selectedCategories.length > 0 && (
//             <div className="flex flex-wrap gap-2 mb-4">
//               {selectedCategories.map((category) => (
//                 <span
//                   key={category}
//                   className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full flex items-center gap-2"
//                 >
//                   {category}
//                   <button
//                     type="button"
//                     onClick={() => removeCategory(category)}
//                     className="hover:text-orange-900 dark:hover:text-orange-100"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Predefined Categories */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             {PREDEFINED_CATEGORIES.map((category) => (
//               <button
//                 key={category}
//                 type="button"
//                 onClick={() => toggleCategory(category)}
//                 className={`px-3 py-1 text-sm rounded-full border transition-colors ${
//                   selectedCategories.includes(category)
//                     ? "bg-orange-500 text-white border-orange-500"
//                     : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-500"
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           {/* Custom Category Input */}
//           <div className="flex gap-2">
//             <Input
//               value={customCategory}
//               onChange={(e) => setCustomCategory(e.target.value)}
//               placeholder="Add a custom category"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   handleAddCustomCategory();
//                 }
//               }}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleAddCustomCategory}
//               disabled={!customCategory.trim()}
//             >
//               Add
//             </Button>
//           </div>
//         </motion.div>

//         {/* Content Editor */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.6 }}
//         >
//           <Label className="text-lg font-semibold mb-4 block">Content *</Label>
//           <TiptapEditor
//             content={editorContent}
//             onChange={setEditorContent}
//             userId=""
//             placeholder="Start writing your post..."
//           />
//         </motion.div>

//         {/* Status Selection */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.7 }}
//           className="flex items-center gap-4"
//         >
//           <Label className="text-lg font-semibold">Status:</Label>
//           <div className="flex gap-4">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 {...register("status")}
//                 value="published"
//                 className="w-4 h-4"
//               />
//               <span className="text-neutral-700 dark:text-neutral-300">
//                 Published
//               </span>
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 {...register("status")}
//                 value="draft"
//                 className="w-4 h-4"
//               />
//               <span className="text-neutral-700 dark:text-neutral-300">
//                 Draft
//               </span>
//             </label>
//           </div>
//         </motion.div>

//         {/* Submit Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="flex gap-4"
//         >
//           <Button
//             type="submit"
//             className="bg-orange-500 hover:bg-orange-600 text-white"
//             disabled={isPending || isUploadingImage}
//           >
//             {isPending ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                 {watchStatus === "draft" ? "Saving Draft..." : "Publishing..."}
//               </>
//             ) : (
//               <>
//                 <Save className="w-4 h-4 mr-2" />
//                 {watchStatus === "draft" ? "Save as Draft" : "Publish Post"}
//               </>
//             )}
//           </Button>

//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.back()}
//             disabled={isPending}
//           >
//             Cancel
//           </Button>
//         </motion.div>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, Phone, MapPin } from "lucide-react";
import { LifestyleSubscriptionForm } from "@/components/specific/lifestyle/LifestyleSubscriptionForm";
import { useTheme } from "next-themes";

export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const { theme } = useTheme();

  return (
    <>
      <section
        className={`w-full py-16 ${theme === "dark" ? "bg-peach-600" : "bg-warm-500"}`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            {/* Lifestyle Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Contact Us
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
            >
              We're here to help and answer any questions you might have. Reach
              out to us and we'll respond as soon as we can.
            </motion.p>

            {/* Subscription Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="max-w-md"
            >
              <LifestyleSubscriptionForm />
            </motion.div>

            {/* Privacy Policy Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="text-sm text-white/70 max-w-md"
            >
              Subscribe to get the latest updates straight to you
            </motion.p>
          </motion.div>
        </div>
      </section>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Get in Touch
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Whether you're looking for support, have feedback to share, or
              want to explore partnership opportunities, we'd love to connect
              with you.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                        Email
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        info@kimberly-ryan.net
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                        Phone
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        +234(0)9135827236
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                        Address
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        123 Landmark Street
                        <br />
                        Suite 100
                        <br />
                        Victoria Island, Lagos
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg">
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg"
                  >
                    ✓ Thank you for your message! We'll get back to you soon.
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                    >
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                    >
                      Subject *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="How can we help you?"
                        className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
