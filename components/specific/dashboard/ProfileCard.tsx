"use client";

import { useState } from "react";
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
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { updateProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";

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
  };
}

export function ProfileCard({ userData }: ProfileCardProps) {
  const [formData, setFormData] = useState(userData);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfileAction(formData);

      if (result.success) {
        toast.success(result.message);
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

  const handleCancel = () => {
    setFormData(userData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Profile
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage details of your personal profile.
        </p>
      </div>

      <div className="space-y-6">
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
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
            />
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
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
            />
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
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
              />
            </div>
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
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
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
              value={formData.location}
              onValueChange={(value) => handleInputChange("location", value)}
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
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="min-h-[120px] bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Years of Experience Field */}
        <div className="space-y-2">
          <Label
            htmlFor="experience"
            className="text-neutral-700 dark:text-neutral-300"
          >
            How long have you been a recruiter?
          </Label>
          <Input
            id="experience"
            value={formData.yearsOfExperience}
            onChange={(e) =>
              handleInputChange("yearsOfExperience", e.target.value)
            }
            placeholder="Input number of years of recruiting experience"
            className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
