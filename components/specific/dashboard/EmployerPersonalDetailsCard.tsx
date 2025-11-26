"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateEmployerProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { ChevronDown, ChevronRight, Edit3 } from "lucide-react";

interface EmployerPersonalDetailsCardProps {
  userData: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    recruiterExperience?: string | null;
  };
  onUserDataUpdate?: (updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    recruiterExperience?: string | null;
    profilePicture?: string | null;
  }) => void;
  isEditMode?: boolean;
}

export interface EmployerPersonalDetailsCardRef {
  save: () => Promise<void>;
  hasUnsavedChanges: () => boolean;
}

export const EmployerPersonalDetailsCard = forwardRef<
  EmployerPersonalDetailsCardRef,
  EmployerPersonalDetailsCardProps
>(({ userData, onUserDataUpdate, isEditMode = false }, ref) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    location: userData.location || "",
    bio: userData.bio || "",
    recruiterExperience: userData.recruiterExperience || "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
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

  // Expose save and hasUnsavedChanges methods via ref
  useImperativeHandle(ref, () => ({
    save: handleSave,
    hasUnsavedChanges: () => hasChanges,
  }));

  // Handle form field changes
  const handleFieldChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handle form submission
  const handleSave = async () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateEmployerProfileAction({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        recruiterExperience: formData.recruiterExperience || null,
      });

      if (result.success) {
        // Notify parent component of updates
        onUserDataUpdate?.({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location || null,
          bio: formData.bio || null,
          recruiterExperience: formData.recruiterExperience || null,
        });

        // Only show toast if not in edit mode
        if (!isEditMode) {
          toast.success("Personal details updated successfully!");
        }

        // Auto-collapse the form after successful save (only if not in edit mode)
        if (!isEditMode) {
          setIsCollapsed(true);
        }
      } else {
        toast.error(result.message || "Failed to update personal details");
      }
    } catch (error) {
      console.error("Failed to update personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle form reset
  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      location: userData.location || "",
      bio: userData.bio || "",
      recruiterExperience: userData.recruiterExperience || "",
    });
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if form has been modified
  const hasChanges =
    formData.firstName !== (userData.firstName || "") ||
    formData.lastName !== (userData.lastName || "") ||
    formData.email !== (userData.email || "") ||
    formData.phone !== (userData.phone || "") ||
    formData.location !== (userData.location || "") ||
    formData.bio !== (userData.bio || "") ||
    formData.recruiterExperience !== (userData.recruiterExperience || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
    >
      {/* Header with collapse toggle */}
      <div
        className="mb-6 cursor-pointer flex items-center justify-between"
        onClick={toggleCollapse}
      >
        <div>
          <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
            Personal Details
          </h3>
          <p className="text-[#64748B] dark:text-neutral-400">
            Tell us about yourself and your recruiting experience.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#64748B]" />
          )}
        </div>
      </div>

      {/* Collapsed Summary View */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 text-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Name:
                </span>
                <span className="ml-2 text-[#334155] dark:text-neutral-100">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Email:
                </span>
                <span className="ml-2 text-[#334155] dark:text-neutral-100">
                  {formData.email}
                </span>
              </div>
              {formData.phone && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Phone:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.phone}
                  </span>
                </div>
              )}
              {formData.location && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Location:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.location}
                  </span>
                </div>
              )}
              {formData.recruiterExperience && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Recruiter Experience:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.recruiterExperience}
                  </span>
                </div>
              )}
            </div>
            {formData.bio && (
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Bio:
                </span>
                <p className="mt-1 text-[#334155] dark:text-neutral-100">
                  {formData.bio}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Form View */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-[#363231] dark:text-neutral-200"
                >
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-[#363231] dark:text-neutral-200"
                >
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[#363231] dark:text-neutral-200"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="Enter your email address"
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-[#363231] dark:text-neutral-200"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
              />
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-[#363231] dark:text-neutral-200"
              >
                Location
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleFieldChange("location", value)}
              >
                <SelectTrigger className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                {/* <SelectContent>
                  <SelectItem value="United States of America">
                    🇺🇸 United States of America
                  </SelectItem>
                  <SelectItem value="United Kingdom">
                    🇬🇧 United Kingdom
                  </SelectItem>
                  <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                  <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                  <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                  <SelectItem value="France">🇫🇷 France</SelectItem>
                  <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                  <SelectItem value="India">🇮🇳 India</SelectItem>
                  <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                  <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
                </SelectContent> */}
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.code} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recruiter Experience Field */}
            <div className="space-y-2">
              <Label
                htmlFor="recruiterExperience"
                className="text-[#363231] dark:text-neutral-200"
              >
                How long have you been a recruiter? *
              </Label>
              <Select
                value={formData.recruiterExperience}
                onValueChange={(value) =>
                  handleFieldChange("recruiterExperience", value)
                }
              >
                <SelectTrigger className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-[#363231] dark:text-neutral-200"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your recruiting approach..."
                rows={4}
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155] resize-none"
              />
            </div>

            {/* Action Buttons - Only show if not in edit mode */}
            {!isEditMode && (
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="bg-warm-200 hover:bg-warm-300 text-white px-6 py-2"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
