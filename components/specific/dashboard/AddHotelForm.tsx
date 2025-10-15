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
import { createHotelAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import {
  uploadHotelFeaturedImage,
  uploadHotelGalleryImage,
} from "@/app/(dashboard)/actions/upload-actions";
import Image from "next/image";

// Validation schema
const hotelFormSchema = z.object({
  name: z.string().min(3, "Hotel name must be at least 3 characters").max(255),
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
  pricePerNight: z.coerce
    .number()
    .min(1, "Price must be at least 1")
    .max(10000000),
  currency: z.string().min(1, "Currency is required"),
  category: z.string().min(1, "Category is required"),
  // Amenities - comma-separated string that will be split into array
  amenities: z.string().min(1, "At least one amenity is required"),
  // Features - comma-separated string
  features: z.string().min(1, "At least one feature is required"),
  // Policies
  checkIn: z.string().min(1, "Check-in time is required"),
  checkOut: z.string().min(1, "Check-out time is required"),
  cancellation: z.string().min(1, "Cancellation policy is required"),
  pets: z.string().min(1, "Pet policy is required"),
  smoking: z.string().min(1, "Smoking policy is required"),
  // Contact
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z
    .string()
    .url("Valid website URL is required")
    .optional()
    .or(z.literal("")),
});

type HotelFormData = z.infer<typeof hotelFormSchema>;

interface AddHotelFormProps {
  userId: string;
  fullName?: string;
}

export function AddHotelForm({ userId }: AddHotelFormProps) {
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
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      currency: "₦",
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      pets: "Pets not allowed",
      smoking: "Non-smoking property",
    },
  });

  const hotelName = watch("name");

  const handleFeaturedImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
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

    // Limit to 5 images
    if (galleryImages.length + files.length > 5) {
      toast.error("You can upload maximum 5 gallery images");
      return;
    }

    // Validate each file
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

    // Add to gallery
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

  const onSubmit = async (data: HotelFormData) => {
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
      featuredFormData.append("hotelName", data.name);

      const featuredUploadResult =
        await uploadHotelFeaturedImage(featuredFormData);
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
          galleryFormData.append("hotelId", "temp"); // Will be updated after hotel creation

          const galleryUploadResult =
            await uploadHotelGalleryImage(galleryFormData);

          if (galleryUploadResult.success && galleryUploadResult.url) {
            uploadedGalleryUrls.push(galleryUploadResult.url);
          }
        }
        setIsUploadingGallery(false);
      }

      // Parse amenities and features from comma-separated strings
      const amenitiesArray = data.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      const featuresArray = data.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      // Create hotel
      const hotelData = {
        name: data.name,
        description: data.description,
        fullDescription: data.fullDescription,
        location: data.location,
        address: data.address || null,
        pricePerNight: data.pricePerNight,
        currency: data.currency,
        category: data.category,
        featuredImage: featuredUploadResult.url || null,
        images: uploadedGalleryUrls,
        amenities: amenitiesArray,
        features: featuresArray,
        policies: {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          cancellation: data.cancellation,
          pets: data.pets,
          smoking: data.smoking,
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

      const result = await createHotelAction(hotelData);

      if (result.success) {
        toast.success("Hotel added successfully!");
        router.push("/dashboard/hotels-restaurants");
      } else {
        toast.error(result.error || "Failed to create hotel");
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
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
          Add New Hotel
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Fill in the details to add a new hotel to your properties
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
                Hotel Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Eko Hotel & Suites"
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
                placeholder="e.g., Luxury Hotel, Business Hotel"
              />
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pricePerNight">
                Price Per Night (₦) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pricePerNight"
                type="number"
                {...register("pricePerNight")}
                placeholder="e.g., 85000"
              />
              {errors.pricePerNight && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pricePerNight.message}
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
              Main image for your hotel (Max 5MB)
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

        {/* Amenities & Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Amenities & Features
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="amenities">
                Amenities <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="amenities"
                {...register("amenities")}
                placeholder="Enter amenities separated by commas (e.g., Free Wi-Fi, Parking, Breakfast, Swimming Pool)"
                rows={3}
              />
              <p className="text-sm text-neutral-500 mt-1">
                Separate multiple amenities with commas
              </p>
              {errors.amenities && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.amenities.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="features">
                Special Features <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="features"
                {...register("features")}
                placeholder="Enter special features separated by commas (e.g., Waterfront Location, Business Center, Event Facilities)"
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
            Hotel Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="checkIn">
                Check-in Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="checkIn"
                {...register("checkIn")}
                placeholder="e.g., 2:00 PM"
              />
              {errors.checkIn && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.checkIn.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="checkOut">
                Check-out Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="checkOut"
                {...register("checkOut")}
                placeholder="e.g., 12:00 PM"
              />
              {errors.checkOut && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.checkOut.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cancellation">
                Cancellation Policy <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cancellation"
                {...register("cancellation")}
                placeholder="e.g., Free cancellation up to 24 hours before check-in"
              />
              {errors.cancellation && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cancellation.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pets">
                Pet Policy <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pets"
                {...register("pets")}
                placeholder="e.g., Pets not allowed"
              />
              {errors.pets && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pets.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="smoking">
                Smoking Policy <span className="text-red-500">*</span>
              </Label>
              <Input
                id="smoking"
                {...register("smoking")}
                placeholder="e.g., Non-smoking property"
              />
              {errors.smoking && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.smoking.message}
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
                placeholder="e.g., +234 1 277 7000"
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
                placeholder="e.g., info@hotel.com"
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
                placeholder="e.g., https://www.hotel.com"
              />
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
                    : "Creating hotel..."}
              </>
            ) : (
              "Add Hotel"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
