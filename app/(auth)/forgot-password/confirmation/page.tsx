import { AuthSidebar } from "@/components/layout/AuthSidebar";
import ResetLinkSent from "./ResetLinkSent";

export default function ConfirmationPage() {
  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left side: marketing/branding (hidden on mobile) */}
      <AuthSidebar heading="Your one stop shop for everything that is important to you" />

      {/* Right side: confirmation message */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-8 py-16 bg-white dark:bg-neutral-900">
        <div className="w-full md:w-[68%]">
          <ResetLinkSent />
        </div>
      </div>
    </div>
  );
}
