import { AuthSidebar } from "@/components/layout/AuthSidebar";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left side: marketing/branding (hidden on mobile) */}
      <AuthSidebar heading="Your one stop shop for everything that is important to you" />

      {/* Right side: reset password form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="w-full md:w-[68%]">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
