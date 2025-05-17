"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/form";
import { Button } from "@/components/common/button";

interface ResetPasswordFormProps {
  token: string;
}

const formSchema = z
  .object({
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

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Here you would connect to your API to reset the password
      console.log("Password reset with token:", token);
      console.log("New password:", values.password);

      // For now, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to login page after successful password reset
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = form.formState.isValid;

  return (
    <div className="w-full space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="text-gray-500 mt-2">
          Create a new password for your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      className="focus-visible:ring-warm-200"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  At least 8 characters and one number.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=""
                      className="focus-visible:ring-warm-200"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={`w-full ${
              isFormValid
                ? "bg-warm-200 hover:bg-warm-300"
                : "bg-[#E2E8F0] text-[#64748B] cursor-not-allowed"
            }`}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
