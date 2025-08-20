"use client";

import { useState } from "react";
import { Calendar, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
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

// Zod schema for form validation
const createJobPostSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title must be less than 100 characters"),
  deadline: z.string().min(1, "Deadline is required"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters")
    .max(2000, "Job description must be less than 2000 characters"),
  jobLocation: z.string().min(1, "Job location is required"),
  industry: z.string().min(1, "Industry is required"),
  salaryRange: z.string().min(1, "Salary range is required"),
  currency: z.string().min(1, "Currency is required"),
  jobType: z.string().min(1, "Job type is required"),

  companyLogo: z.instanceof(File).optional().or(z.literal("")),
  multimediaContent: z.instanceof(File).optional().or(z.literal("")),
});

type CreateJobPostFormData = z.infer<typeof createJobPostSchema>;

interface CreateJobPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJobPostDialog({
  open,
  onOpenChange,
}: CreateJobPostDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateJobPostFormData>({
    resolver: zodResolver(createJobPostSchema),
    mode: "onChange",
    defaultValues: {
      jobTitle: "",
      deadline: "01/04/2025",
      jobDescription: "",
      jobLocation: "",
      industry: "",
      salaryRange: "",
      currency: "NGN",
      jobType: "",
      companyLogo: undefined,
      multimediaContent: undefined,
    },
  });

  const onSubmit = async (data: CreateJobPostFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement job post creation logic
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and close dialog on success
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating job post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview job post");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const handleFileUpload = (
    field: keyof Pick<
      CreateJobPostFormData,
      "companyLogo" | "multimediaContent"
    >,
    file: File | null
  ) => {
    setValue(field, file || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[719px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-container border border-neutral-200 dark:border-[#313337] rounded-2xl mx-4 sm:mx-0">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-[#D8DDE7] text-left">
            Create Job Post
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="space-y-4 sm:space-y-6"
        >
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Row 1: Job Title and Select Deadline */}
            <div className="space-y-2">
              <Label
                htmlFor="jobTitle"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Job Title
              </Label>
              <Input
                id="jobTitle"
                placeholder="Input Job Title"
                {...register("jobTitle")}
                className={`h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors ${
                  errors.jobTitle ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.jobTitle && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="deadline"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Select Deadline
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <Input
                  id="deadline"
                  type="date"
                  {...register("deadline")}
                  className={`h-11 pl-10 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors ${
                    errors.deadline ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            {/* Row 2: Job Description (spans two columns) */}
            <div className="lg:col-span-2 space-y-2">
              <Label
                htmlFor="jobDescription"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Job Description
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Content"
                {...register("jobDescription")}
                className={`min-h-[120px] border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] placeholder:text-neutral-500 dark:placeholder:text-neutral-400 resize-none text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors ${
                  errors.jobDescription
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
              {errors.jobDescription && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            {/* Row 3: Job Location and Industry */}
            <div className="space-y-2">
              <Label
                htmlFor="jobLocation"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Job Location
              </Label>
              <Select
                value={watch("jobLocation")}
                onValueChange={(value) => setValue("jobLocation", value)}
              >
                <SelectTrigger
                  className={`h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] text-sm sm:text-base transition-colors ${
                    errors.jobLocation
                      ? "border-red-500 dark:border-red-500"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Input or select job location" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0D0D0D] border-neutral-300 dark:border-[#313337]">
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
              {errors.jobLocation && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.jobLocation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="industry"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Industry
              </Label>
              <Select
                value={watch("industry")}
                onValueChange={(value) => setValue("industry", value)}
              >
                <SelectTrigger
                  className={`h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] text-sm sm:text-base transition-colors ${
                    errors.industry ? "border-red-500 dark:border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Input or select job industry" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0D0D0D] border-neutral-300 dark:border-[#313337]">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Row 4: Salary Range and Job Type */}
            <div className="space-y-2">
              <Label
                htmlFor="salaryRange"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Salary Range
              </Label>
              <div className="flex gap-2">
                <Input
                  id="salaryRange"
                  placeholder="e.g., 50000 - 80000"
                  {...register("salaryRange")}
                  className={`flex-1 h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors ${
                    errors.salaryRange
                      ? "border-red-500 dark:border-red-500"
                      : ""
                  }`}
                />
                <Select
                  value={watch("currency")}
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger
                    className={`w-24 h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] text-sm sm:text-base transition-colors`}
                  >
                    <SelectValue placeholder="₦" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#0D0D0D] border-neutral-300 dark:border-[#313337]">
                    <SelectItem value="NGN">₦ NGN</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                    <SelectItem value="GBP">£ GBP</SelectItem>
                    <SelectItem value="CAD">$ CAD</SelectItem>
                    <SelectItem value="AUD">$ AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.salaryRange && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.salaryRange.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="jobType"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Job Type
              </Label>
              <Select
                value={watch("jobType")}
                onValueChange={(value) => setValue("jobType", value)}
              >
                <SelectTrigger
                  className={`h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] text-sm sm:text-base transition-colors ${
                    errors.jobType ? "border-red-500 dark:border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0D0D0D] border-neutral-300 dark:border-[#313337]">
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              {errors.jobType && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.jobType.message}
                </p>
              )}
            </div>

            {/* Row 6: Upload company logo and Multimedia content */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]">
                Upload company logo
              </Label>
              <div className="border-2 border-dashed border-[#CBD5E1] dark:border-[#273444] rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-[#94A3B8] dark:hover:border-[#334155] transition-colors cursor-pointer">
                <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-neutral-400 dark:text-neutral-500 mb-2 sm:mb-3 lg:mb-4" />
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2">
                  Drop your files or click to upload
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2 sm:mb-3 lg:mb-4">
                  Supported file types: JPG, PNG or Webp
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[#E2E8F0] dark:border-[#18212E] text-neutral-700 dark:text-[#D8DDE7] hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Browse
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]">
                Multimedia content{" "}
                <span className="text-neutral-500 dark:text-neutral-400">
                  (optional)
                </span>
              </Label>
              <div className="border-2 border-dashed border-[#CBD5E1] dark:border-[#273444] rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-[#94A3B8] dark:hover:border-[#334155] transition-colors cursor-pointer">
                <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-neutral-400 dark:text-neutral-500 mb-2 sm:mb-3 lg:mb-4" />
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2">
                  Drop your files or click to upload
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2 sm:mb-3 lg:mb-4">
                  Supported file types: JPG, PNG or Webp
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[#E2E8F0] dark:border-[#18212E] text-neutral-700 dark:text-[#D8DDE7] hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Browse
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto border-[#E2E8F0] dark:border-[#18212E] text-neutral-700 dark:text-[#D8DDE7] hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 border border-orange-600 dark:border-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Job Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
