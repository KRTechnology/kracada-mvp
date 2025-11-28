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
import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
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
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  yearsOfExperience: z.string().nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileCardProps {
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    location: string | null;
    bio: string | null;
    yearsOfExperience: string | null;
    accountType: string;
  };
  onUserDataUpdate?: (updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    yearsOfExperience?: string | null;
  }) => void;
  isEditMode?: boolean;
}

export interface ProfileCardRef {
  save: () => Promise<void>;
}

export const ProfileCard = forwardRef<ProfileCardRef, ProfileCardProps>(
  ({ userData, onUserDataUpdate, isEditMode = false }, ref) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const countries = [
      { name: "Afghanistan", code: "AF" },
      { name: "Albania", code: "AL" },
      { name: "Algeria", code: "DZ" },
      { name: "Andorra", code: "AD" },
      { name: "Angola", code: "AO" },
      { name: "Antigua and Barbuda", code: "AG" },
      { name: "Argentina", code: "AR" },
      { name: "Armenia", code: "AM" },
      { name: "Australia", code: "AU" },
      { name: "Austria", code: "AT" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Bahamas", code: "BS" },
      { name: "Bahrain", code: "BH" },
      { name: "Bangladesh", code: "BD" },
      { name: "Barbados", code: "BB" },
      { name: "Belarus", code: "BY" },
      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },
      { name: "Benin", code: "BJ" },
      { name: "Bhutan", code: "BT" },
      { name: "Bolivia", code: "BO" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Botswana", code: "BW" },
      { name: "Brazil", code: "BR" },
      { name: "Brunei", code: "BN" },
      { name: "Bulgaria", code: "BG" },
      { name: "Burkina Faso", code: "BF" },
      { name: "Burundi", code: "BI" },
      { name: "Cabo Verde", code: "CV" },
      { name: "Cambodia", code: "KH" },
      { name: "Cameroon", code: "CM" },
      { name: "Canada", code: "CA" },
      { name: "Central African Republic", code: "CF" },
      { name: "Chad", code: "TD" },
      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Colombia", code: "CO" },
      { name: "Comoros", code: "KM" },
      { name: "Congo, Democratic Republic of", code: "CD" },
      { name: "Congo, Republic of", code: "CG" },
      { name: "Costa Rica", code: "CR" },
      { name: "Côte d’Ivoire", code: "CI" },
      { name: "Croatia", code: "HR" },
      { name: "Cuba", code: "CU" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Djibouti", code: "DJ" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Eritrea", code: "ER" },
      { name: "Estonia", code: "EE" },
      { name: "Eswatini", code: "SZ" },
      { name: "Ethiopia", code: "ET" },
      { name: "Fiji", code: "FJ" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "Gabon", code: "GA" },
      { name: "Gambia", code: "GM" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Ghana", code: "GH" },
      { name: "Greece", code: "GR" },
      { name: "Grenada", code: "GD" },
      { name: "Guatemala", code: "GT" },
      { name: "Guinea", code: "GN" },
      { name: "Guinea-Bissau", code: "GW" },
      { name: "Guyana", code: "GY" },
      { name: "Haiti", code: "HT" },
      { name: "Honduras", code: "HN" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Iran", code: "IR" },
      { name: "Iraq", code: "IQ" },
      { name: "Ireland", code: "IE" },
      { name: "Israel", code: "IL" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Jordan", code: "JO" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kenya", code: "KE" },
      { name: "Kiribati", code: "KI" },
      { name: "Kuwait", code: "KW" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: "Laos", code: "LA" },
      { name: "Latvia", code: "LV" },
      { name: "Lebanon", code: "LB" },
      { name: "Lesotho", code: "LS" },
      { name: "Liberia", code: "LR" },
      { name: "Libya", code: "LY" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Madagascar", code: "MG" },
      { name: "Malawi", code: "MW" },
      { name: "Malaysia", code: "MY" },
      { name: "Maldives", code: "MV" },
      { name: "Mali", code: "ML" },
      { name: "Malta", code: "MT" },
      { name: "Marshall Islands", code: "MH" },
      { name: "Mauritania", code: "MR" },
      { name: "Mauritius", code: "MU" },
      { name: "Mexico", code: "MX" },
      { name: "Micronesia", code: "FM" },
      { name: "Moldova", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Mongolia", code: "MN" },
      { name: "Montenegro", code: "ME" },
      { name: "Morocco", code: "MA" },
      { name: "Mozambique", code: "MZ" },
      { name: "Myanmar", code: "MM" },
      { name: "Namibia", code: "NA" },
      { name: "Nauru", code: "NR" },
      { name: "Nepal", code: "NP" },
      { name: "Netherlands", code: "NL" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niger", code: "NE" },
      { name: "Nigeria", code: "NG" },
      { name: "North Korea", code: "KP" },
      { name: "North Macedonia", code: "MK" },
      { name: "Norway", code: "NO" },
      { name: "Oman", code: "OM" },
      { name: "Pakistan", code: "PK" },
      { name: "Palau", code: "PW" },
      { name: "Panama", code: "PA" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Qatar", code: "QA" },
      { name: "Romania", code: "RO" },
      { name: "Russia", code: "RU" },
      { name: "Rwanda", code: "RW" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "Samoa", code: "WS" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Senegal", code: "SN" },
      { name: "Serbia", code: "RS" },
      { name: "Seychelles", code: "SC" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Korea", code: "KR" },
      { name: "South Sudan", code: "SS" },
      { name: "Spain", code: "ES" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Syria", code: "SY" },
      { name: "Taiwan", code: "TW" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Tanzania", code: "TZ" },
      { name: "Thailand", code: "TH" },
      { name: "Timor-Leste", code: "TL" },
      { name: "Togo", code: "TG" },
      { name: "Tonga", code: "TO" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkey", code: "TR" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Tuvalu", code: "TV" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United Arab Emirates", code: "AE" },
      { name: "United Kingdom", code: "GB" },
      { name: "United States", code: "US" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Vatican City", code: "VA" },
      { name: "Venezuela", code: "VE" },
      { name: "Vietnam", code: "VN" },
      { name: "Yemen", code: "YE" },
      { name: "Zambia", code: "ZM" },
      { name: "Zimbabwe", code: "ZW" },
    ];

    // Memoize defaultValues to prevent unnecessary re-renders
    const defaultValues = useMemo(
      () => ({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
        location: userData.location || "",
        bio: userData.bio || "",
        yearsOfExperience: userData.yearsOfExperience || "",
      }),
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phone,
        userData.location,
        userData.bio,
        userData.yearsOfExperience,
      ]
    );

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty, isValid },
      reset,
      watch,
      setValue,
    } = useForm<ProfileFormData>({
      resolver: zodResolver(profileFormSchema),
      defaultValues,
      mode: "onChange", // Enable real-time validation
    });

    const watchedAccountType = userData.accountType;

    // Expose save function to parent component
    useImperativeHandle(ref, () => ({
      save: async () => {
        const formData = {
          firstName: watch("firstName"),
          lastName: watch("lastName"),
          email: watch("email"),
          phone: watch("phone"),
          location: watch("location"),
          bio: watch("bio"),
          yearsOfExperience: watch("yearsOfExperience"),
        };
        await onSubmit(formData);
      },
    }));

    const onSubmit = async (data: ProfileFormData) => {
      setIsSaving(true);
      try {
        // Convert form data to match the expected format for updateProfileAction
        const userDataUpdate = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || undefined,
          location: data.location || undefined,
          bio: data.bio || undefined,
          yearsOfExperience: data.yearsOfExperience || undefined,
        };

        const result = await updateProfileAction(userDataUpdate);

        if (result.success) {
          // Only show toast if not in edit mode (to avoid multiple toasts)
          if (!isEditMode) {
            toast.success(result.message);
          }

          // Notify parent component of the update with nullable format
          onUserDataUpdate?.({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || null,
            location: data.location || null,
            bio: data.bio || null,
            yearsOfExperience: data.yearsOfExperience || null,
          });

          // Reset form to mark as clean after successful save
          reset(data);

          // Only trigger collapse animation if not in edit mode
          if (!isEditMode) {
            setTimeout(() => {
              setIsCollapsed(true);
            }, 500); // Small delay to show success message
          }
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
      if (isCollapsed && !isEditMode) {
        setIsCollapsed(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-sm transition-all duration-300 p-6 ${
          isCollapsed && !isEditMode ? "cursor-pointer hover:shadow-md" : ""
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

        {(!isCollapsed || isEditMode) && (
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
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.code} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  {/* <SelectContent>
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
                  </SelectContent> */}
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

            {/* Action Buttons - Only show if not in edit mode */}
            {!isEditMode && (
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </motion.form>
        )}
      </motion.div>
    );
  }
);
