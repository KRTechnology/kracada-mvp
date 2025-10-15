"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Label } from "@/components/common/label";
import { toast } from "sonner";
import { createRestaurantAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import {
  uploadRestaurantFeaturedImage,
  uploadRestaurantGalleryImage,
} from "@/app/(dashboard)/actions/upload-actions";
import Image from "next/image";

// Validation schema
const restaurantFormSchema = z.object({
  name: z
    .string()
    .min(3, "Restaurant name must be at least 3 characters")
    .max(255),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500),
  fullDescription: z
    .string()
    .min(50, "Full description must be at least 50 characters")
    .max(2000),
  location: z.string().min(3, "Location is required").max(255),
  address: z.string().optional(),
  priceRange: z.enum(["$", "$$", "$$$", "$$$$"], {
    required_error: "Price range is required",
  }),
  cuisine: z.string().min(1, "Cuisine type is required"),
  category: z.string().min(1, "Category is required"),
  openingHours: z.string().min(1, "Opening hours are required"),
  // Features, specialties, ambiance - comma-separated strings
  features: z.string().min(1, "At least one feature is required"),
  specialties: z.string().min(1, "At least one specialty is required"),
  ambiance: z.string().min(1, "At least one ambiance tag is required"),
  // Policies
  reservations: z.string().min(1, "Reservations policy is required"),
  dressCode: z.string().min(1, "Dress code is required"),
  minimumAge: z.string().min(1, "Minimum age policy is required"),
  cancellation: z.string().min(1, "Cancellation policy is required"),
  payment: z.string().min(1, "Payment policy is required"),
  // Contact
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z
    .string()
    .url("Valid website URL is required")
    .optional()
    .or(z.literal("")),
});

type RestaurantFormData = z.infer<typeof restaurantFormSchema>;

interface AddRestaurantFormProps {
  userId: string;
  fullName?: string;
}

export function AddRestaurantForm({ userId }: AddRestaurantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      priceRange: "$$",
      reservations: "Recommended, especially for dinner",
      dressCode: "Smart casual",
      minimumAge: "All ages welcome",
      cancellation: "24-hour cancellation policy",
      payment: "All major cards accepted",
    },
  });

  const restaurantName = watch("name");

  const handleFeaturedImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setFeaturedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (galleryImages.length + files.length > 5) {
      toast.error("You can upload maximum 5 gallery images");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Each image should be less than 3MB");
        return;
      }
    }

    const newImageUrls: string[] = [];
    const newFiles: File[] = [];

    for (const file of files) {
      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageUrls.push(reader.result as string);
        if (newImageUrls.length === files.length) {
          setGalleryImages([...galleryImages, ...newImageUrls]);
          setGalleryImageFiles([...galleryImageFiles, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    setGalleryImageFiles(galleryImageFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RestaurantFormData) => {
    if (!featuredImageFile) {
      toast.error("Please upload a featured image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload featured image
      setIsUploadingFeatured(true);
      const featuredFormData = new FormData();
      featuredFormData.append("file", featuredImageFile);
      featuredFormData.append("userId", userId);
      featuredFormData.append("restaurantName", data.name);

      const featuredUploadResult =
        await uploadRestaurantFeaturedImage(featuredFormData);
      setIsUploadingFeatured(false);

      if (!featuredUploadResult.success) {
        toast.error(featuredUploadResult.error || "Failed to upload image");
        setIsSubmitting(false);
        return;
      }

      // Upload gallery images
      const uploadedGalleryUrls: string[] = [];
      if (galleryImageFiles.length > 0) {
        setIsUploadingGallery(true);
        for (const file of galleryImageFiles) {
          const galleryFormData = new FormData();
          galleryFormData.append("file", file);
          galleryFormData.append("userId", userId);
          galleryFormData.append("restaurantId", "temp");

          const galleryUploadResult =
            await uploadRestaurantGalleryImage(galleryFormData);

          if (galleryUploadResult.success && galleryUploadResult.url) {
            uploadedGalleryUrls.push(galleryUploadResult.url);
          }
        }
        setIsUploadingGallery(false);
      }

      // Parse arrays from comma-separated strings
      const featuresArray = data.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      const specialtiesArray = data.specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const ambianceArray = data.ambiance
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      // Create restaurant
      const restaurantData = {
        name: data.name,
        description: data.description,
        fullDescription: data.fullDescription,
        location: data.location,
        address: data.address || null,
        priceRange: data.priceRange,
        cuisine: data.cuisine,
        category: data.category,
        openingHours: data.openingHours,
        featuredImage: featuredUploadResult.url || null,
        images: uploadedGalleryUrls,
        features: featuresArray,
        specialties: specialtiesArray,
        ambiance: ambianceArray,
        menuHighlights: [], // Can be added later in edit
        policies: {
          reservations: data.reservations,
          dressCode: data.dressCode,
          minimumAge: data.minimumAge,
          cancellation: data.cancellation,
          payment: data.payment,
        },
        contact: {
          phone: data.phone,
          email: data.email,
          website: data.website || "",
        },
        isPublished: false,
        rating: "0.00",
        reviewCount: 0,
      };

      const result = await createRestaurantAction(restaurantData);

      if (result.success) {
        toast.success("Restaurant added successfully!");
        router.push("/dashboard/hotels-restaurants");
      } else {
        toast.error(result.error || "Failed to create restaurant");
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-warm-200 dark:hover:text-warm-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Properties</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Add New Restaurant
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Fill in the details to add a new restaurant to your properties
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="name">
                Restaurant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Sky Restaurant & Bar"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description (20-500 characters)"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="fullDescription">
                Full Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="fullDescription"
                {...register("fullDescription")}
                placeholder="Detailed description (50-2000 characters)"
                rows={6}
              />
              {errors.fullDescription && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullDescription.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="e.g., Fine Dining, Casual Dining"
              />
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cuisine">
                Cuisine Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cuisine"
                {...register("cuisine")}
                placeholder="e.g., Nigerian, Italian, International"
              />
              {errors.cuisine && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cuisine.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="priceRange">
                Price Range <span className="text-red-500">*</span>
              </Label>
              <select
                id="priceRange"
                {...register("priceRange")}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200"
              >
                <option value="$">$ - Budget</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Expensive</option>
                <option value="$$$$">$$$$ - Luxury</option>
              </select>
              {errors.priceRange && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.priceRange.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="openingHours">
                Opening Hours <span className="text-red-500">*</span>
              </Label>
              <Input
                id="openingHours"
                {...register("openingHours")}
                placeholder="e.g., 6:00 PM - 12:00 AM"
              />
              {errors.openingHours && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.openingHours.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="e.g., Victoria Island, Lagos"
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Full Address (Optional)</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Full street address"
              />
            </div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Images
          </h2>

          {/* Featured Image */}
          <div>
            <Label>
              Featured Image <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Main image for your restaurant (Max 5MB)
            </p>
            <div className="flex items-start gap-4">
              {featuredImage ? (
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700">
                  <Image
                    src={featuredImage}
                    alt="Featured"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null);
                      setFeaturedImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click to upload featured image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <Label>Gallery Images (Optional)</Label>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Additional images (Max 5 images, 3MB each)
            </p>
            <div className="space-y-4">
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700"
                    >
                      <Image
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {galleryImages.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Add gallery images ({galleryImages.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </motion.div>

        {/* Features & Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Features & Specialties
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="features">
                Features <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="features"
                {...register("features")}
                placeholder="Enter features separated by commas (e.g., Rooftop Dining, Private Rooms, Live Entertainment)"
                rows={3}
              />
              <p className="text-sm text-neutral-500 mt-1">
                Separate multiple features with commas
              </p>
              {errors.features && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.features.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="specialties">
                Specialties <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="specialties"
                {...register("specialties")}
                placeholder="Enter specialties separated by commas (e.g., Contemporary Nigerian Cuisine, Premium Steaks, Craft Cocktails)"
                rows={3}
              />
              <p className="text-sm text-neutral-500 mt-1">
                Separate multiple specialties with commas
              </p>
              {errors.specialties && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.specialties.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ambiance">
                Ambiance Tags <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="ambiance"
                {...register("ambiance")}
                placeholder="Enter ambiance tags separated by commas (e.g., Romantic Atmosphere, Business Friendly, Date Night Perfect)"
                rows={2}
              />
              <p className="text-sm text-neutral-500 mt-1">
                Separate multiple tags with commas
              </p>
              {errors.ambiance && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.ambiance.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Restaurant Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="reservations">
                Reservations Policy <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reservations"
                {...register("reservations")}
                placeholder="e.g., Recommended, especially for dinner"
              />
              {errors.reservations && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.reservations.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dressCode">
                Dress Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dressCode"
                {...register("dressCode")}
                placeholder="e.g., Smart casual to formal"
              />
              {errors.dressCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.dressCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="minimumAge">
                Age Requirement <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minimumAge"
                {...register("minimumAge")}
                placeholder="e.g., All ages welcome"
              />
              {errors.minimumAge && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.minimumAge.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cancellation">
                Cancellation Policy <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cancellation"
                {...register("cancellation")}
                placeholder="e.g., 24-hour cancellation policy"
              />
              {errors.cancellation && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cancellation.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="payment">
                Payment Policy <span className="text-red-500">*</span>
              </Label>
              <Input
                id="payment"
                {...register("payment")}
                placeholder="e.g., All major cards accepted"
              />
              {errors.payment && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.payment.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="e.g., +234 801 234 5678"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="e.g., info@restaurant.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="e.g., https://www.restaurant.com"
              />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Note:</strong> Menu items can be added later by editing the
            restaurant after creation.
          </p>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1 md:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploadingFeatured
                  ? "Uploading featured image..."
                  : isUploadingGallery
                    ? "Uploading gallery images..."
                    : "Creating restaurant..."}
              </>
            ) : (
              "Add Restaurant"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
