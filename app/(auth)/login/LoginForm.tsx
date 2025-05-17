"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { Checkbox } from "@/components/common/checkbox";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    // Handle login logic here
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
          >
            Log in
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
