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
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-200">
          Admin Log in
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Enter your account details below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-700 dark:text-neutral-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@domain.com"
                    className="focus-visible:ring-warm-200 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200"
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
                <FormLabel className="text-neutral-700 dark:text-neutral-300">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      className="focus-visible:ring-warm-200 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
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
                          className="text-gray-500 dark:text-gray-400"
                        />
                      ) : (
                        <Eye
                          size={18}
                          className="text-gray-500 dark:text-gray-400"
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
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-neutral-700 dark:text-neutral-300">
                  Remember for 30 days
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                <span>Logging in...</span>
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
