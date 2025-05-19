"use client";

import { Input } from "@/components/common/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { loginAction, type LoginFormData } from "../actions";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
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

  async function onSubmit(values: LoginFormData) {
    setIsSubmitting(true);

    try {
      const result = await loginAction(values);

      if (result.success) {
        toast.success(result.message);
        // Redirect to dashboard on successful login
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Log in</h1>
        <p className="text-gray-500 mt-2">Enter your account details below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@domain.com"
                    className="focus-visible:ring-warm-200"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder=""
                      className="focus-visible:ring-warm-200"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
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
                <FormLabel className="text-sm font-normal">
                  Remember for 30 days
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-warm-200 hover:bg-warm-300"
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

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-warm-200 hover:underline">
            Sign up
          </Link>
        </p>
        <Link
          href="/forgot-password"
          className="text-warm-200 hover:underline text-sm block mt-2"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
