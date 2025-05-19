"use server";

import { authService } from "@/lib/auth/auth-service";
import { emailService } from "@/lib/email/email.service";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

// Schema for login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Schema for signup validation
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  accountType: z.enum(
    ["Job Seeker", "Employer", "Business Owner", "Contributor"],
    { required_error: "Account type is required" }
  ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Must contain at least 1 number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least 1 special character"
    ),
  terms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions",
  }),
});

// Schema for forgot password validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema for reset password validation
const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least 1 special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for verification email request
const verificationEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = Omit<
  z.infer<typeof resetPasswordSchema>,
  "token"
>;
export type VerificationEmailFormData = z.infer<typeof verificationEmailSchema>;

// Login action
export async function loginAction(data: LoginFormData) {
  try {
    // Validate the data
    const validatedData = loginSchema.parse(data);

    // Attempt to sign in the user
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      // Handle known auth errors
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" };
        case "CallbackRouteError":
          return { success: false, message: "Invalid credentials" };
        default:
          return { success: false, message: "Authentication failed" };
      }
    } else if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return { success: false, message: "An unexpected error occurred" };
  }
}

// Get the base URL for links
const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
};

// Sign up action
export async function signupAction(data: SignupFormData) {
  try {
    // Validate the data
    const validatedData = signupSchema.parse(data);

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(validatedData.email);
    if (existingUser) {
      return { success: false, message: "User with this email already exists" };
    }

    // Create the user
    const { id } = await authService.createUser({
      fullName: validatedData.fullName,
      email: validatedData.email,
      accountType: validatedData.accountType,
      password: validatedData.password,
      termsAccepted: validatedData.terms,
    });

    // Create verification token
    const token = await authService.createEmailVerificationToken(id);

    // Generate the verification link
    const baseUrl = getBaseUrl();
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    // Send welcome email with verification link
    try {
      await emailService.sendWelcomeEmail({
        email: validatedData.email,
        fullName: validatedData.fullName,
        verificationLink,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue with signup process even if email fails
    }

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    console.error("Signup error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Forgot password action
export async function forgotPasswordAction(data: ForgotPasswordFormData) {
  try {
    // Validate the data
    const validatedData = forgotPasswordSchema.parse(data);

    // Check if user exists
    const user = await authService.getUserByEmail(validatedData.email);

    // If user doesn't exist, we still return success for security reasons
    // This prevents email enumeration attacks
    if (!user) {
      return {
        success: true,
        message:
          "If a user with that email exists, a password reset link has been sent",
      };
    }

    // Create password reset token
    const token = await authService.createPasswordResetToken(user.id);

    // Generate the reset link
    const baseUrl = getBaseUrl();
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail({
        email: validatedData.email,
        resetLink,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Still return success for security reasons
    }

    return { success: true, message: "Password reset link sent to your email" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    console.error("Forgot password error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Reset password action
export async function resetPasswordAction(
  token: string,
  data: ResetPasswordFormData
) {
  try {
    // Validate the data with token
    const validatedData = resetPasswordSchema.parse({ ...data, token });

    // Verify token and get user id
    const resetToken = await authService.verifyPasswordResetToken(token);
    if (!resetToken) {
      return { success: false, message: "Invalid or expired token" };
    }

    // Get user info for the email
    const user = await authService.getUserById(resetToken.userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Reset the password
    const success = await authService.resetPassword(
      validatedData.token,
      validatedData.password
    );

    if (!success) {
      return { success: false, message: "Invalid or expired token" };
    }

    // Send password changed confirmation email
    try {
      await emailService.sendPasswordChangedEmail({
        email: user.email,
        fullName: user.fullName,
      });
    } catch (emailError) {
      console.error("Failed to send password changed email:", emailError);
      // Continue with the process even if email fails
    }

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    console.error("Reset password error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Request verification email action
export async function requestVerificationEmailAction(
  data: VerificationEmailFormData
) {
  try {
    // Validate the data
    const validatedData = verificationEmailSchema.parse(data);

    // Check if user exists
    const user = await authService.getUserByEmail(validatedData.email);

    // If user doesn't exist, still return success for security reasons
    if (!user) {
      return {
        success: true,
        message:
          "If your email exists in our system, a verification link has been sent",
      };
    }

    // If user is already verified, let them know
    if (user.emailVerified) {
      return {
        success: true,
        message:
          "Your email is already verified. You can log in to your account.",
      };
    }

    // Create verification token
    const token = await authService.createEmailVerificationToken(user.id);

    // Generate the verification link
    const baseUrl = getBaseUrl();
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    // Send verification email
    try {
      await emailService.sendWelcomeEmail({
        email: user.email,
        fullName: user.fullName,
        verificationLink,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Still return success for security reasons
    }

    return {
      success: true,
      message: "Verification link sent to your email",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    console.error("Verification email request error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Sign out action
export async function signOutAction() {
  // try {
  await signOut();
  return { success: true };
  // } catch (error) {
  // console.error("Sign out error:", error);
  // return { success: false, message: "Failed to sign out" };
  // }
}
