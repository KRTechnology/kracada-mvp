import { AuthSidebar } from "@/components/layout/AuthSidebar";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left side: marketing/branding (hidden on mobile) */}
      <AuthSidebar />

      {/* Right side: signup form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-8 py-20 bg-white">
        <div className="w-full md:w-[68%]">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
