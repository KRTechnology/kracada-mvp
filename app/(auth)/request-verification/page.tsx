import { AuthSidebar } from "@/components/layout/AuthSidebar";
import RequestVerificationForm from "./RequestVerificationForm";

export default function RequestVerificationPage() {
  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left side: marketing/branding (hidden on mobile) */}
      <AuthSidebar heading="Your one stop shop for everything that is important to you" />

      {/* Right side: verification request form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="w-full md:w-[68%]">
          <RequestVerificationForm />
        </div>
      </div>
    </div>
  );
}
