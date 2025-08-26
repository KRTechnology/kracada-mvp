"use client";

import { useState, useEffect } from "react";
import { Calendar, X, Plus } from "lucide-react";
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
import { updateJobAction } from "@/app/(dashboard)/actions/job-actions";
import { toast } from "sonner";

// Zod schema for form validation (same as create)
const editJobPostSchema = z.object({
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
  locationType: z.enum(["remote", "onsite", "hybrid"]),
  industry: z.string().min(1, "Industry is required"),
  salaryRange: z.string().min(1, "Salary range is required"),
  currency: z.string().min(1, "Currency is required"),
  jobType: z.string().min(1, "Job type is required"),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement is required"),
});

type EditJobPostFormData = z.infer<typeof editJobPostSchema>;

interface EditJobPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobData: {
    id: string;
    title: string;
    description: string;
    location: string;
    locationType: "remote" | "onsite" | "hybrid";
    industry: string;
    jobType:
      | "full-time"
      | "part-time"
      | "contract"
      | "internship"
      | "freelance";
    salaryRange: string;
    currency: string;
    deadline: Date;
    requiredSkills: string;
    requirements: string;
  };
}

export function EditJobPostDialog({
  open,
  onOpenChange,
  jobData,
}: EditJobPostDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  // Predefined skills for easy selection
  const predefinedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "HTML/CSS",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "Figma",
    "Photoshop",
    "Project Management",
    "UI/UX Design",
    "Data Analysis",
    "Machine Learning",
    "DevOps",
    "Agile",
    "Scrum",
    "Customer Service",
    "Sales",
    "Marketing",
    "Content Writing",
    "Graphic Design",
    "Video Editing",
    "Social Media Management",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<EditJobPostFormData>({
    resolver: zodResolver(editJobPostSchema),
    mode: "onChange",
    defaultValues: {
      jobTitle: jobData.title,
      deadline: jobData.deadline.toISOString().split("T")[0], // Convert Date to YYYY-MM-DD
      jobDescription: jobData.description,
      jobLocation: jobData.location,
      locationType: jobData.locationType,
      industry: jobData.industry,
      salaryRange: jobData.salaryRange,
      currency: jobData.currency,
      jobType: jobData.jobType,
      requiredSkills: [],
      requirements: [],
    },
  });

  // Initialize skills from job data
  useEffect(() => {
    try {
      const parsedSkills = JSON.parse(jobData.requiredSkills);
      if (Array.isArray(parsedSkills)) {
        setSkills(parsedSkills);
        setValue("requiredSkills", parsedSkills, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error parsing skills:", error);
      setSkills([]);
    }
  }, [jobData.requiredSkills, setValue]);

  // Initialize requirements from job data
  useEffect(() => {
    try {
      const parsedRequirements = JSON.parse(jobData.requirements);
      if (Array.isArray(parsedRequirements)) {
        setRequirements(parsedRequirements);
        setValue("requirements", parsedRequirements, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error parsing requirements:", error);
      setRequirements([]);
    }
  }, [jobData.requirements, setValue]);

  // Sync skills state with form validation
  useEffect(() => {
    if (skills.length > 0) {
      setValue("requiredSkills", skills, { shouldValidate: true });
    }
  }, [skills, setValue]);

  // Sync requirements state with form validation
  useEffect(() => {
    if (requirements.length > 0) {
      setValue("requirements", requirements, { shouldValidate: true });
    }
  }, [requirements, setValue]);

  const onSubmit = async (data: EditJobPostFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for server action
      const updateData = {
        id: jobData.id,
        title: data.jobTitle,
        description: data.jobDescription,
        location: data.jobLocation,
        locationType: data.locationType,
        industry: data.industry,
        jobType: data.jobType as
          | "full-time"
          | "part-time"
          | "contract"
          | "internship"
          | "freelance",
        salaryRange: data.salaryRange,
        currency: data.currency,
        deadline: data.deadline,
        requiredSkills: data.requiredSkills,
        requirements: data.requirements,
      };

      const result = await updateJobAction(updateData);

      if (result.success) {
        toast.success("Job post updated successfully!");
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update job post");
      }
    } catch (error) {
      console.error("Error updating job post:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setSkills(JSON.parse(jobData.requiredSkills));
    setRequirements(JSON.parse(jobData.requirements));
    onOpenChange(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue("requiredSkills", updatedSkills, { shouldValidate: true });
      setNewSkill("");
    }
  };

  const addSkillFromDropdown = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      setValue("requiredSkills", updatedSkills, { shouldValidate: true });
    }
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !requirements.includes(newRequirement.trim())
    ) {
      const updatedRequirements = [...requirements, newRequirement.trim()];
      setRequirements(updatedRequirements);
      setValue("requirements", updatedRequirements, { shouldValidate: true });
      setNewRequirement("");
    }
  };

  const removeRequirement = (requirementToRemove: string) => {
    const updatedRequirements = requirements.filter(
      (req) => req !== requirementToRemove
    );
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements, { shouldValidate: true });
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue("requiredSkills", updatedSkills, { shouldValidate: true });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleRequirementKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[719px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-container border border-neutral-200 dark:border-[#313337] rounded-2xl mx-4 sm:mx-0">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-[#D8DDE7] text-left">
            Edit Job Post
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

            {/* Row 3: Job Location and Location Type */}
            <div className="space-y-2">
              <Label
                htmlFor="jobLocation"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Job Location
              </Label>
              <Input
                id="jobLocation"
                placeholder="e.g., Lagos, Nigeria"
                {...register("jobLocation")}
                className={`h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors ${
                  errors.jobLocation ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.jobLocation && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.jobLocation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="locationType"
                className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]"
              >
                Location Type
              </Label>
              <Select
                value={watch("locationType")}
                onValueChange={(value) =>
                  setValue(
                    "locationType",
                    value as "remote" | "onsite" | "hybrid"
                  )
                }
              >
                <SelectTrigger
                  className={`h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] text-sm sm:text-base transition-colors ${
                    errors.locationType
                      ? "border-red-500 dark:border-red-500"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0D0D0D] border-neutral-300 dark:border-[#313337]">
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.locationType && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.locationType.message}
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

            {/* Row 7: Required Skills (spans full width) */}
            <div className="lg:col-span-2 space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]">
                Required Skills *
              </Label>
              <div className="space-y-3">
                {/* Skills Display */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Input */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                      Select from common skills:
                    </Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value && !skills.includes(value)) {
                          addSkillFromDropdown(value);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white dark:bg-[#0D0D0D] border-[#E2E8F0] dark:border-[#18212E] text-neutral-900 dark:text-[#D8DDE7] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors">
                        <SelectValue placeholder="Choose a skill to add" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#0D0D0D] border-neutral-300 dark:border-[#313337]">
                        {predefinedSkills
                          .filter((skill) => !skills.includes(skill))
                          .map((skill) => (
                            <SelectItem key={skill} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                      Or add a custom skill:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Type your custom skill"
                        className="flex-1 h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                        onKeyPress={handleKeyPress}
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        variant="outline"
                        size="sm"
                        className="h-11 px-4 border-[#E2E8F0] dark:border-[#18212E] text-neutral-700 dark:text-[#D8DDE7] hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newSkill.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Add or select your required skills
                  </p>
                </div>

                {errors.requiredSkills && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.requiredSkills.message}
                  </p>
                )}
              </div>
            </div>

            {/* Requirements Section (spans full width) */}
            <div className="lg:col-span-2 space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#D8DDE7]">
                Job Requirements *
              </Label>
              <div className="space-y-3">
                {/* Requirements Display */}
                {requirements.length > 0 && (
                  <div className="space-y-2">
                    {requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
                      >
                        <span className="text-blue-800 dark:text-blue-200 text-sm flex-1">
                          • {requirement}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(requirement)}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 flex-shrink-0 mt-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Requirements Input */}
                <div>
                  <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                    Add job requirements:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="e.g., 4+ years of experience in frontend development"
                      className="flex-1 h-11 border-[#E2E8F0] dark:border-[#18212E] bg-white dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#D8DDE7] placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                      onKeyPress={handleRequirementKeyPress}
                    />
                    <Button
                      type="button"
                      onClick={addRequirement}
                      variant="outline"
                      size="sm"
                      className="h-11 px-4 border-[#E2E8F0] dark:border-[#18212E] text-neutral-700 dark:text-[#D8DDE7] hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newRequirement.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Add specific requirements for this job position
                </p>

                {errors.requirements && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.requirements.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto border-[#E2E8F0] dark:border-[#18212E] text-neutral-700 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 border border-orange-600 dark:border-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Job Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
