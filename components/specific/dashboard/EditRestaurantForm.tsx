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
import { updateRestaurantAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import {
  uploadRestaurantFeaturedImage,
  uploadRestaurantGalleryImage,
} from "@/app/(dashboard)/actions/upload-actions";
import { Restaurant } from "@/lib/db/schema";
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
  features: z.string().min(1, "At least one feature is required"),
  specialties: z.string().min(1, "At least one specialty is required"),
  ambiance: z.string().min(1, "At least one ambiance tag is required"),
  reservations: z.string().min(1, "Reservations policy is required"),
  dressCode: z.string().min(1, "Dress code is required"),
  minimumAge: z.string().min(1, "Minimum age policy is required"),
  cancellation: z.string().min(1, "Cancellation policy is required"),
  payment: z.string().min(1, "Payment policy is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z
    .string()
    .url("Valid website URL is required")
    .optional()
    .or(z.literal("")),
});

type RestaurantFormData = z.infer<typeof restaurantFormSchema>;

interface EditRestaurantFormProps {
  userId: string;
  fullName?: string;
  initialData: Restaurant;
}

export function EditRestaurantForm({
  userId,
  initialData: restaurant,
}: EditRestaurantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    restaurant.featuredImage || null
  );
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    Array.isArray(restaurant.images) ? restaurant.images : []
  );
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      fullDescription: restaurant.fullDescription,
      location: restaurant.location,
      address: restaurant.address || "",
      priceRange: restaurant.priceRange as "$" | "$$" | "$$$" | "$$$$",
      cuisine: restaurant.cuisine,
      category: restaurant.category,
      openingHours: restaurant.openingHours,
      features: Array.isArray(restaurant.features)
        ? restaurant.features.join(", ")
        : "",
      specialties: Array.isArray(restaurant.specialties)
        ? restaurant.specialties.join(", ")
        : "",
      ambiance: Array.isArray(restaurant.ambiance)
        ? restaurant.ambiance.join(", ")
        : "",
      reservations: restaurant.policies.reservations,
      dressCode: restaurant.policies.dressCode,
      minimumAge: restaurant.policies.minimumAge,
      cancellation: restaurant.policies.cancellation,
      payment: restaurant.policies.payment,
      phone: restaurant.contact.phone,
      email: restaurant.contact.email,
      website: restaurant.contact.website || "",
    },
  });

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
    if (galleryImages[index].startsWith("data:")) {
      setGalleryImageFiles(galleryImageFiles.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true);

    try {
      let finalFeaturedImage = featuredImage;

      // Upload new featured image if changed
      if (featuredImageFile) {
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

        finalFeaturedImage = featuredUploadResult.url || null;
      }

      // Upload new gallery images
      const existingGalleryUrls = galleryImages.filter(
        (url) => !url.startsWith("data:")
      );
      const uploadedGalleryUrls: string[] = [...existingGalleryUrls];

      if (galleryImageFiles.length > 0) {
        setIsUploadingGallery(true);
        for (const file of galleryImageFiles) {
          const galleryFormData = new FormData();
          galleryFormData.append("file", file);
          galleryFormData.append("userId", userId);
          galleryFormData.append("restaurantId", restaurant.id);

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

      // Update restaurant
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
        featuredImage: finalFeaturedImage,
        images: uploadedGalleryUrls,
        features: featuresArray,
        specialties: specialtiesArray,
        ambiance: ambianceArray,
        menuHighlights: restaurant.menuHighlights, // Keep existing menu highlights
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
      };

      const result = await updateRestaurantAction(
        restaurant.id,
        restaurantData
      );

      if (result.success) {
        toast.success("Restaurant updated successfully!");
        router.push("/dashboard/hotels-restaurants");
      } else {
        toast.error(result.error || "Failed to update restaurant");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
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
          Edit Restaurant
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Update your restaurant details
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
                placeholder="Brief description"
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
                placeholder="Detailed description"
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
                placeholder="e.g., Fine Dining"
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
                placeholder="e.g., Nigerian"
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
              <Input id="openingHours" {...register("openingHours")} />
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
              <Input id="location" {...register("location")} />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Full Address (Optional)</Label>
              <Input id="address" {...register("address")} />
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
                  <label className="absolute bottom-2 right-2 px-3 py-1 bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm cursor-pointer hover:bg-white dark:hover:bg-neutral-800">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageChange}
                      className="hidden"
                    />
                  </label>
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
                placeholder="Enter features separated by commas"
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
                placeholder="Enter specialties separated by commas"
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
                placeholder="Enter ambiance tags separated by commas"
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
              <Input id="reservations" {...register("reservations")} />
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
              <Input id="dressCode" {...register("dressCode")} />
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
              <Input id="minimumAge" {...register("minimumAge")} />
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
              <Input id="cancellation" {...register("cancellation")} />
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
              <Input id="payment" {...register("payment")} />
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
              <Input id="phone" {...register("phone")} />
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
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input id="website" {...register("website")} />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
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
                    : "Updating restaurant..."}
              </>
            ) : (
              "Update Restaurant"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
