"use server";

import { db } from "@/lib/db/drizzle";
import { users, experiences } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Schema for profile update validation
const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio: z.string().optional(),
  yearsOfExperience: z.string().optional(),
});

// Schema for skills and job preferences update
const skillsPreferencesSchema = z.object({
  skills: z.array(z.string()).optional(),
  jobPreferences: z.array(z.string()).optional(),
});

// Schema for experience validation
const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  employmentType: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Temporary",
  ]),
  company: z.string().min(1, "Company is required"),
  currentlyWorking: z.boolean().default(false),
  startMonth: z.string().optional(),
  startYear: z.string().optional(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

// Schema for experience update (includes id)
const experienceUpdateSchema = experienceSchema.extend({
  id: z.string().optional(),
});

// Schema for website and portfolio update validation
const websitePortfolioSchema = z.object({
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio: z.string().optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type SkillsPreferencesData = z.infer<typeof skillsPreferencesSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type ExperienceUpdateData = z.infer<typeof experienceUpdateSchema>;
export type WebsitePortfolioData = z.infer<typeof websitePortfolioSchema>;

// Get current user
async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}

// Update user profile
export async function updateProfileAction(data: ProfileUpdateData) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    const validatedData = profileUpdateSchema.parse(data);

    // Update the user profile
    await db
      .update(users)
      .set({
        fullName: `${validatedData.firstName} ${validatedData.lastName}`.trim(),
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        location: validatedData.location || null,
        bio: validatedData.bio || null,
        website: validatedData.website || null,
        portfolio: validatedData.portfolio || null,
        yearsOfExperience: validatedData.yearsOfExperience
          ? parseInt(validatedData.yearsOfExperience)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return { success: false, message: "Failed to update profile" };
  }
}

// Update skills and job preferences
export async function updateSkillsPreferencesAction(
  data: SkillsPreferencesData
) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    const validatedData = skillsPreferencesSchema.parse(data);

    // Update the user skills and preferences
    await db
      .update(users)
      .set({
        skills: validatedData.skills
          ? JSON.stringify(validatedData.skills)
          : null,
        jobPreferences: validatedData.jobPreferences
          ? JSON.stringify(validatedData.jobPreferences)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Skills and preferences updated successfully",
    };
  } catch (error) {
    console.error("Skills preferences update error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return {
      success: false,
      message: "Failed to update skills and preferences",
    };
  }
}

// Update profile picture and CV
export async function updateFileUploadsAction(data: {
  profilePicture?: string | null;
  cv?: string | null;
}) {
  try {
    const userId = await getCurrentUser();

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided in the data
    if (data.profilePicture !== undefined) {
      updateData.profilePicture = data.profilePicture;
    }
    if (data.cv !== undefined) {
      updateData.cv = data.cv;
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Files updated successfully" };
  } catch (error) {
    console.error("File uploads update error:", error);
    return { success: false, message: "Failed to update files" };
  }
}

// Update employer profile picture only (no CV)
export async function updateEmployerProfilePictureAction(
  profilePicture: string | null
) {
  try {
    const userId = await getCurrentUser();

    await db
      .update(users)
      .set({
        profilePicture,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Profile picture updated successfully" };
  } catch (error) {
    console.error("Employer profile picture update error:", error);
    return { success: false, message: "Failed to update profile picture" };
  }
}

// Update company logo
export async function updateCompanyLogoAction(companyLogo: string | null) {
  try {
    const userId = await getCurrentUser();

    await db
      .update(users)
      .set({
        companyLogo,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Company logo updated successfully" };
  } catch (error) {
    console.error("Company logo update error:", error);
    return { success: false, message: "Failed to update company logo" };
  }
}

// Update employer profile data
export async function updateEmployerProfileAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  recruiterExperience?: string | null;
}) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim()) {
      return {
        success: false,
        message: "First name, last name, and email are required",
      };
    }

    // Update the user profile
    await db
      .update(users)
      .set({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email.trim(),
        phone: data.phone || null,
        location: data.location || null,
        bio: data.bio || null,
        recruiterExperience: data.recruiterExperience || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Employer profile update error:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

// Update employer company details
export async function updateEmployerCompanyDetailsAction(data: {
  companyName: string;
  companyDescription?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
}) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    if (!data.companyName.trim()) {
      return {
        success: false,
        message: "Company name is required",
      };
    }

    // Update the user's company details
    await db
      .update(users)
      .set({
        companyName: data.companyName.trim(),
        companyDescription: data.companyDescription || null,
        companyWebsite: data.companyWebsite || null,
        companyEmail: data.companyEmail || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Company details updated successfully" };
  } catch (error) {
    console.error("Employer company details update error:", error);
    return { success: false, message: "Failed to update company details" };
  }
}

// Create new experience
export async function createExperienceAction(data: ExperienceData) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    const validatedData = experienceSchema.parse(data);

    // Create the experience
    const [newExperience] = await db
      .insert(experiences)
      .values({
        userId,
        jobTitle: validatedData.jobTitle,
        employmentType: validatedData.employmentType,
        company: validatedData.company,
        currentlyWorking: validatedData.currentlyWorking,
        startMonth: validatedData.startMonth || null,
        startYear: validatedData.startYear || null,
        endMonth: validatedData.endMonth || null,
        endYear: validatedData.endYear || null,
        description: validatedData.description || null,
        skills: validatedData.skills
          ? JSON.stringify(validatedData.skills)
          : null,
      })
      .returning();

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Experience added successfully",
      data: {
        ...newExperience,
        skills: newExperience.skills ? JSON.parse(newExperience.skills) : [],
      },
    };
  } catch (error) {
    console.error("Experience creation error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return { success: false, message: "Failed to add experience" };
  }
}

// Update existing experience
export async function updateExperienceAction(data: ExperienceUpdateData) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    const validatedData = experienceUpdateSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, message: "Experience ID is required" };
    }

    // Update the experience
    const [updatedExperience] = await db
      .update(experiences)
      .set({
        jobTitle: validatedData.jobTitle,
        employmentType: validatedData.employmentType,
        company: validatedData.company,
        currentlyWorking: validatedData.currentlyWorking,
        startMonth: validatedData.startMonth || null,
        startYear: validatedData.startYear || null,
        endMonth: validatedData.endMonth || null,
        endYear: validatedData.endYear || null,
        description: validatedData.description || null,
        skills: validatedData.skills
          ? JSON.stringify(validatedData.skills)
          : null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(experiences.id, validatedData.id),
          eq(experiences.userId, userId)
        )
      )
      .returning();

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Experience updated successfully",
      data: {
        ...updatedExperience,
        skills: updatedExperience.skills
          ? JSON.parse(updatedExperience.skills)
          : [],
      },
    };
  } catch (error) {
    console.error("Experience update error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return { success: false, message: "Failed to update experience" };
  }
}

// Delete experience
export async function deleteExperienceAction(experienceId: string) {
  try {
    const userId = await getCurrentUser();

    // Delete the experience
    await db
      .delete(experiences)
      .where(
        and(eq(experiences.id, experienceId), eq(experiences.userId, userId))
      );

    revalidatePath("/dashboard");
    return { success: true, message: "Experience deleted successfully" };
  } catch (error) {
    console.error("Experience deletion error:", error);
    return { success: false, message: "Failed to delete experience" };
  }
}

// Update website and portfolio
export async function updateWebsitePortfolioAction(data: WebsitePortfolioData) {
  try {
    const userId = await getCurrentUser();

    // Validate the data
    const validatedData = websitePortfolioSchema.parse(data);

    // Update the user website and portfolio
    await db
      .update(users)
      .set({
        website: validatedData.website || null,
        portfolio: validatedData.portfolio || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Website and portfolio updated successfully",
    };
  } catch (error) {
    console.error("Website portfolio update error:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return {
      success: false,
      message: "Failed to update website and portfolio",
    };
  }
}

// Get user profile data
export async function getUserProfileAction() {
  try {
    const userId = await getCurrentUser();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return { success: false, message: "User not found" };
    }

    const userData = user[0];

    // Parse JSON fields
    const skills = userData.skills ? JSON.parse(userData.skills) : [];
    const jobPreferences = userData.jobPreferences
      ? JSON.parse(userData.jobPreferences)
      : [];

    // Split fullName into firstName and lastName if they don't exist
    let firstName = userData.firstName;
    let lastName = userData.lastName;

    if (!firstName && !lastName && userData.fullName) {
      const nameParts = userData.fullName.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    return {
      success: true,
      data: {
        ...userData,
        firstName: firstName || "",
        lastName: lastName || "",
        skills,
        jobPreferences,
        accountType: userData.accountType,
      },
    };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { success: false, message: "Failed to get user profile" };
  }
}

// Get user experiences
export async function getUserExperiencesAction() {
  try {
    const userId = await getCurrentUser();

    const userExperiences = await db
      .select()
      .from(experiences)
      .where(eq(experiences.userId, userId))
      .orderBy(experiences.createdAt);

    // Parse JSON fields
    const experiencesWithParsedSkills = userExperiences.map((exp) => ({
      ...exp,
      skills: exp.skills ? JSON.parse(exp.skills) : [],
    }));

    return {
      success: true,
      data: experiencesWithParsedSkills,
    };
  } catch (error) {
    console.error("Get user experiences error:", error);
    return { success: false, message: "Failed to get user experiences" };
  }
}

// Mark profile as completed
export async function markProfileCompletedAction() {
  try {
    const userId = await getCurrentUser();

    await db
      .update(users)
      .set({
        hasCompletedProfile: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard");
    return { success: true, message: "Profile marked as completed" };
  } catch (error) {
    console.error("Mark profile completed error:", error);
    return { success: false, message: "Failed to mark profile as completed" };
  }
}
