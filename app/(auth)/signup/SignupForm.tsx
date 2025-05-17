"use client";

import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import {
  FormField,
  FormMessage,
  FormLabel,
  FormItem,
  FormControl,
  FormDescription,
} from "@/components/common/form";
import { Input } from "@/components/common/input";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/common/select";
// import { Checkbox } from "@/components/common/Checkbox";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/common/Form";
// import { Input } from "@/components/common/Input";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/common/Select";
import Link from "next/link";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

const accountTypes = [
  "Job Seeker",
  "Employer",
  "Business Owner",
  "Contributor",
];

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

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      accountType: undefined,
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    // Handle sign up logic here (API call)
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-neutral-900">Sign up</h2>
        <p className="mb-6 text-neutral-500">
          Sign up for free and become a member.
        </p>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input your first & last name"
                    {...field}
                    autoComplete="name"
                    className="focus-visible:ring-warm-200"
                  />
                </FormControl>
                {/* <FormDescription>Input your first last name</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@domain.com"
                    {...field}
                    autoComplete="email"
                    className="focus-visible:ring-warm-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:ring-warm-200">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      placeholder="Password"
                      {...field}
                      autoComplete="new-password"
                      className="focus-visible:ring-warm-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                {/* <FormDescription>
                  Min. 8 characters, at least 1 uppercase, 1 number, 1 special
                  character
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-neutral-700 font-normal">
                    By signing up, you agree to our{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="underline text-peach-200"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="underline text-peach-200"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 mt-2 bg-warm-200 hover:bg-warm-300"
          >
            Submit
          </Button>
        </form>
      </FormProvider>
      <p className="mt-6 text-center text-neutral-500 text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-peach-200 font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
