"use client";

import { updateProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Textarea } from "@/components/common/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { shouldShowRecruiterExperience } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  yearsOfExperience: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileCardProps {
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    yearsOfExperience: string;
    accountType: string;
  };
  onUserDataUpdate?: (updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
    yearsOfExperience?: string;
  }) => void;
}

export function ProfileCard({ userData, onUserDataUpdate }: ProfileCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
      yearsOfExperience: userData.yearsOfExperience,
    },
    mode: "onChange", // Enable real-time validation
  });

  const watchedAccountType = userData.accountType;

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const result = await updateProfileAction(data);

      if (result.success) {
        toast.success(result.message);

        // Notify parent component of the update
        onUserDataUpdate?.(data);

        // Reset form to mark as clean after successful save
        reset(data);
        // Trigger collapse animation after successful save
        setTimeout(() => {
          setIsCollapsed(true);
        }, 500); // Small delay to show success message
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission with validation
  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    // Show validation errors to user
    console.error("Form validation errors:", errors);
    toast.error("Please fix the validation errors before saving.");
  });

  const handleCardClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-sm transition-all duration-300 p-6 ${
        isCollapsed ? "cursor-pointer hover:shadow-md" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Profile
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage details of your personal profile.
        </p>
      </div>

      {!isCollapsed && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleFormSubmit}
          className="space-y-6"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-neutral-700 dark:text-neutral-300"
              >
                First name
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                  errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Last name
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                  errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Phone number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                />
              </div>
            </div>
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Select
                value={watch("location") || ""}
                onValueChange={(value) => {
                  setValue("location", value);
                }}
              >
                <SelectTrigger className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States of America">
                    🇺🇸 United States of America
                  </SelectItem>
                  <SelectItem value="United Kingdom">
                    🇬🇧 United Kingdom
                  </SelectItem>
                  <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                  <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                  <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                  <SelectItem value="France">🇫🇷 France</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label
              htmlFor="bio"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Bio
            </Label>
            <Textarea
              id="bio"
              {...register("bio")}
              className="min-h-[120px] bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Years of Experience Field - Only show for Employer and Business Owner */}
          {shouldShowRecruiterExperience(watchedAccountType) && (
            <div className="space-y-2">
              <Label
                htmlFor="experience"
                className="text-neutral-700 dark:text-neutral-300"
              >
                How long have you been a recruiter?
              </Label>
              <Input
                id="experience"
                {...register("yearsOfExperience")}
                placeholder="Input number of years of recruiting experience"
                className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}
