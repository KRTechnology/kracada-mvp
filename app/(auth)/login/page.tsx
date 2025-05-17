import { AuthSidebar } from "@/components/layout/AuthSidebar";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left side: marketing/branding (hidden on mobile) */}
      <AuthSidebar heading="Your one stop shop for everything that is important to you" />

      {/* Right side: login form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="w-full md:w-[68%]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
