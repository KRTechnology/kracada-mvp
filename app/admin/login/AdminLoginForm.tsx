"use client";

import { Input } from "@/components/common/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/form";
import { Spinner } from "@/components/common/spinner";

type AdminLoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(
      z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, "Password is required"),
        rememberMe: z.boolean().optional(),
      })
    ),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: AdminLoginFormData) {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        isAdmin: "true", // Flag to indicate admin login
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setIsSubmitting(false);
      } else if (result?.ok) {
        toast.success("Login successful");

        // Add a small delay to ensure session is written to cookie
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use window.location.href for a full page reload to ensure session is loaded
        window.location.href = "/admin/dashboard";
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login");
      console.error("Login error:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-warm-600 to-warm-700 dark:from-warm-300 dark:to-warm-400 bg-clip-text text-transparent">
          Admin Portal
        </h1>
        <p className="text-warm-600 dark:text-warm-400 mt-2 font-medium">
          Secure access to your dashboard
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-warm-700 dark:text-warm-300 font-semibold">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@kracada.com"
                    className="focus-visible:ring-warm-200 focus-visible:border-warm-300 bg-warm-50/50 dark:bg-neutral-700/50 border-warm-200 dark:border-warm-600 text-neutral-900 dark:text-neutral-200 placeholder:text-warm-400 dark:placeholder:text-warm-500 transition-colors"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-warm-700 dark:text-warm-300 font-semibold">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="focus-visible:ring-warm-200 focus-visible:border-warm-300 bg-warm-50/50 dark:bg-neutral-700/50 border-warm-200 dark:border-warm-600 text-neutral-900 dark:text-neutral-200 placeholder:text-warm-400 dark:placeholder:text-warm-500 transition-colors pr-12"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warm-500 dark:text-warm-400 hover:text-warm-600 dark:hover:text-warm-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          className="text-warm-500 dark:text-warm-400"
                        />
                      ) : (
                        <Eye
                          size={18}
                          className="text-warm-500 dark:text-warm-400"
                        />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    className="border-warm-300 dark:border-warm-600 data-[state=checked]:bg-warm-200 data-[state=checked]:border-warm-200"
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium text-warm-700 dark:text-warm-300 cursor-pointer">
                  Remember me for 30 days
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-warm-200 to-warm-300 hover:from-warm-300 hover:to-warm-400 text-white dark:text-neutral-900 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
